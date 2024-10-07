import React, { useState, useEffect } from "react";
import { get, put, del, post } from "@aws-amplify/api";
import { Button, FormGroup, FormControl, Modal, FormLabel, Spinner, Form } from "react-bootstrap";
import { getCurrentUser } from 'aws-amplify/auth';
import { useParams, useNavigate } from "react-router-dom";
import "./AddEditGoal.css";

interface AddEditGoalProps {
  match: any;
  history: any;
}



interface Goal {
  goalId: string;
  title: string;
  description: string;
  createdAt: string;
}

const AddEditGoal = () => {
  const { id = '' } = useParams<{ id: string }>(); // replaces match.params
  const navigate = useNavigate();  // replaces history
  const [isExistingGoal, setIsExistingGoal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState(false);
  const [goal, setGoal] = useState<Goal>({
    goalId: '',
    title: '',
    description: '',
    createdAt: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (id) {
      getGoal(id);
      setIsExistingGoal(true);
    }
  }, [id]);

  const getGoal = async (goalId: string) => {
    setIsLoading(true);
    try {
      const { username } = await getCurrentUser();
      const response = await get({ 
        apiName: "apiGoalApp",
        path: `/goal?goalId=${goalId}`,
        options: {
          headers: {
            Username:username
          }
        }
      }).response
      if(response.statusCode != 200){throw new Error("Body of the get goal request is null")};
      const json :string = await response.body.text();
      const goal : Goal = JSON.parse(json);
      setGoal({
        goalId,
        title: goal.title,
        description: goal.description,
        createdAt: goal.createdAt,
      });
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const validateForm = () => goal.title.length > 0 && goal.description.length > 0;

  const handleChange = (event: any) => {
    const { id, value } = event.target;
    setGoal((goal) => ({
      ...goal,
      [id]: value,
    }));
    //console.log(goal);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (event: any) => {
    setIsUpdating(true);
    event.preventDefault();
    if (isExistingGoal) {
      await updateGoal();
    } else {
      await saveGoal();
    }
  };

  const updateGoal = async () => {
    try {
      const { username } = await getCurrentUser();
      console.log(goal);
      const req = {
        goalId: id,
        title: goal.title,
        description: goal.description,
      };
      await put({
        apiName: "apiGoalApp",
        path: "/goal",
        options: { 
          headers: {
            Username: username,
          },
          body: req,
        }
      }).response;

      setIsUpdating(false);
      navigate('/');
    } catch {
      setIsUpdating(false);
    }
  };

  const saveGoal = async () => {
    try {
      const { username } = await getCurrentUser();
      const req = {
        username,
        s3bucket: "myawsbucket-tl",
        goal: {
          createdAt: String(Date.now()),
          title: goal.title,
          description: goal.description
        }
      };
      await post({
        apiName: "apiGoalApp",
        path: "/CreateGoal",
        options: { body: req }
      }).response;

      setIsUpdating(false);
      navigate('/');
    } catch {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { username } = await getCurrentUser();
      const req = {
        username,
        s3bucket: "myawsbucket-tl",
        goalId: id,
      };
      await del({
        apiName: "apiGoalApp",
        path: "/DeleteGoal",
        options: { 
          
        }
      }).response;

      setIsDeleting(false);
      setShowDeleteModal(false);
      navigate('/');
    } catch {
      setIsDeleting(false);
    }
  };

  const deleteModal = () => (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      aria-labelledby="contained-modal-title"
      id="contained-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title">Delete goal</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this goal?</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDelete}>
          {isDeleting ? <Spinner size="sm" animation="border" /> : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="goal">
      {isLoading ? (
        <Spinner animation="border" className="center-spinner" />
      ) : (
        <Form noValidate onSubmit={handleSubmit}>
          <div className="form-body">
            <FormGroup className="blinking-cursor">
              <FormLabel>Goal title</FormLabel>
              <FormControl
                id="title"
                onChange={handleChange}
                value={goal.title}
                minLength={1}
                isValid={goal.title.length > 0}
                placeholder="Enter goal title.."
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Goal description</FormLabel>
              <FormControl
                id="description"
                onChange={handleChange}
                value={goal.description}
                minLength={1}
                isValid={goal.description.length > 0}
                placeholder="Enter goal description.."
                as="textarea"
                required
              />
            </FormGroup>
          </div>

          {isExistingGoal && (
            <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
              Delete
            </Button>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={!validateForm()}
            className="float-right"
          >
            {isUpdating ? (
              <span><Spinner size="sm" animation="border" /> {isExistingGoal ? 'Updating' : 'Creating'}</span>
            ) : (
              <span>{isExistingGoal ? 'Update goal' : 'Create goal'}</span>
            )}
          </Button>

          <Button variant="link" onClick={handleCancel} className="float-right">
            Cancel
          </Button>
        </Form>
      )}

      {showDeleteModal && deleteModal()}
    </div>
  );
};

export default AddEditGoal;