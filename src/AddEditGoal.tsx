import React, { Component } from "react";
import { get, put, del, post } from "@aws-amplify/api";
import { Button, FormGroup, FormControl, Modal, FormLabel, Spinner, Form } from "react-bootstrap";
import { getCurrentUser } from 'aws-amplify/auth';
import "./AddEditGoal.css";

interface AddEditGoalProps {
  match: any;
  history: any;
}

interface AddEditGoalState {
  isExistingGoal: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  goal: Goal;
  showDeleteModal: boolean;
  redirect: string;
}

interface Goal {
  goalId: string;
  title: string;
  description: string;
  createdAt: string;
}

export default class AddEditGoal extends Component<AddEditGoalProps, AddEditGoalState> {
  constructor() {
    const props : AddEditGoalProps = {
      match: 's',
      history: '',
    };
    super(props);

    this.state = {
      redirect: '',
      isExistingGoal: false,
      isLoading: false,
      isUpdating: false,
      isDeleting: false,
      showDeleteModal: false,
      goal: {
        goalId: '',
        title: '',
        description: '',
        createdAt: '',
      },
    };
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.getGoal(id);
      this.setState({
        isExistingGoal: true,
      });
    }

  };

  async getGoal(goalId: string) {
    this.setState({
      isLoading: true,
    });

    try {
      const { username } = await getCurrentUser();
      const req = {
        username: username,
        s3bucket: "myawsbucket-tl",
        goalId: goalId,
      }
      const response = await get({ 
        apiName: "apiGoalApp",
        path: `/goal?goalId=${goalId}`,
        options: {
          headers: {
            username:username
          }
        }
      }).response
      if(response.statusCode != 200){throw new Error("Body of the get goal request is null")};
      const json :string = await response.body.text();
      const goal : Goal = JSON.parse(json);

      this.setState({
        isLoading: false,
        goal: {
          title: goal.title,
          description: goal.description,
          goalId: this.props.match.params.id,
          createdAt: goal.createdAt,
        }
      });
    }
    catch {
      return 1;
    }
    return 0;
  }

  validateForm = () => {
    return this.state.goal.title.length > 0 && this.state.goal.description.length > 0;
  }

  handleChange = (event: any) => {
    const { id, value } = event.target;
    this.setState({
      goal: {
        ...this.state.goal,
        [id]: value
      }
    } as any);
  }

  handleCancel = (event: any) => {
    this.setState({
      redirect: '/'
    });
  }

  handleSubmit = async (event: any) => {
    this.setState ({
      isUpdating: true,
    });
    event.preventDefault();
    this.state.isExistingGoal ? this.updateGoal() : this.saveGoal();
  }

  updateGoal = async () => {
    const { goal } = this.state;
    try {
      const { username } = await getCurrentUser();
      const req = {
        username: username,
        s3bucket: "myawsbucket-tl",
        goal: {
          goalId: this.props.match.params.id,
          title: goal.title,
          description: goal.description
        }
      }
      const { body } = await put({ 
        apiName: "apiGoalApp",
        path: "/EditGoal",
        options: {
          body: req,
        },
      }).response
      if(!body){throw new Error("Body of the get goal request is null")};
      const json: any = await body.json();

      this.setState({
        isUpdating: false,
        redirect: '/'
      });
    }
    catch {
      return 1;
    }
    return 0;
  }

  saveGoal = async () => {
    const { goal } = this.state;
    try {
      const { username } = await getCurrentUser();
      const req = {
        username: username,
        s3bucket: "myawsbucket-tl",
        goal: {
          createdAt: String(Date.now),
          title: goal.title,
          description: goal.description
        }
      }
      const { body } = await post({ 
        apiName: "apiGoalApp",
        path: "/CreateGoal",
        options: {
          body: req,
        },
      }).response
      if(!body){throw new Error("Body of the get goal request is null")};
      const json: any = await body.json();
      this.setState({
        isUpdating: false,
        redirect: '/'
      });
    }
    catch {
      return 1;
    }
    return 0;
  }

  showDeleteModal = (shouldShow: boolean) => {
    this.setState({
      showDeleteModal: shouldShow
    });
  }

  handleDelete = async (event: any) => {
    this.setState({
      isDeleting: true,
    })
    try {
      const { username } = await getCurrentUser();
      const req = {
        username: username,
        s3bucket: "myawsbucket-tl",
        goalId: this.props.match.params.id,
      }
      const { body } = await get({ 
        apiName: "apiGoalApp",
        path: "/CreateGoal",
        options: {
          body: req,
        },
      }).response
      if(!body){throw new Error("Body of the get goal request is null")};
      const json: any = await body.json();
      this.setState({
        isDeleting: false,
        showDeleteModal: false,
        redirect: '/'
      });
    }
    catch {
      return 1;
    }
    return 0;
  }

  deleteModal() {
    return (
      <Modal
        show={this.state.showDeleteModal}
        onHide={() => this.showDeleteModal(false)}
        //container={this}
        aria-labelledby="contained-modal-title"
        id="contained-modal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">Delete goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this goal?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={this.handleDelete}>
            {this.state.isDeleting ?
              <span><Spinner size="sm" animation="border" className="mr-2" />Deleting</span> :
              <span>Delete</span>}
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const { goal, isExistingGoal, showDeleteModal, redirect } = this.state;

    if (redirect) {
      //return <Redirect push to={redirect} />;
    }

    return (
      <div className="goal">
        {this.state.isLoading ? 
          <Spinner animation="border" className="center-spinner" /> : 

          <Form noValidate onSubmit={this.handleSubmit}>

            <div className="form-body">
              <FormGroup className="blinking-cursor">
                <FormLabel>Goal title</FormLabel>
                <FormControl id="title"
                  onChange={this.handleChange}
                  value={goal.title}
                  minLength={1}
                  isValid={goal.title.length > 0}
                  placeholder="Enter goal title.."
                  required />
              </FormGroup>

              <FormGroup >
                <FormLabel>Goal description</FormLabel>
                <FormControl id="description"
                  onChange={this.handleChange}
                  value={goal.description}
                  minLength={1}
                  isValid={goal.description.length > 0}
                  placeholder="Enter goal description.."
                  as="textarea"
                  required />
              </FormGroup>
            </div>

            {isExistingGoal &&
              <Button
                variant="outline-danger"
                onClick={() => this.showDeleteModal(true)}>
                Delete
              </Button>}

            <Button
              variant="primary"
              type="submit"
              disabled={!this.validateForm()}
              className="float-right"
              onClick={this.handleSubmit}>
              {this.state.isUpdating ?
                <span><Spinner size="sm" animation="border" className="mr-2" />{isExistingGoal ? 'Updating' : 'Creating'}</span> :
                <span>{isExistingGoal ? 'Update goal' : 'Create goal'}</span>}
            </Button>

            <Button
              variant="link"
              onClick={this.handleCancel}
              className="float-right">
              Cancel
            </Button>
          </Form>}

        {showDeleteModal && this.deleteModal()}
        
      </div>
    );
  }
}