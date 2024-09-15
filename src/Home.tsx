import React, { Component } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { getCurrentUser } from 'aws-amplify/auth';
import { get } from "@aws-amplify/api";
//import { Redirect } from "react-router-dom";

//import fullStack from "../../images/full-stack.png";
import "./Home.css";
import { error } from "console";

interface HomeProps {
  isAuthenticated: boolean;
}

interface HomeState {
  isLoading: boolean;
  goals: Goal[];
  redirect: boolean;
}

interface Goal {
  description: string;
  goalId: string;
  title: string;
  createdAt: Date;
}

export default class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      isLoading: true,
      goals: [],
      redirect: false,
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const goals = await this.goals();
      console.log(goals);
      this.setState({ goals });
      console.log(goals);
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  async goals() : Promise<Goal[]>{
    try {
      const { username } = await getCurrentUser();
      const response = await get({ 
        apiName: "apiGoalApp",
        path: "/goals",
        options: {
          headers: {
            username:username
          }
        }
      }).response;
      if(!response){throw new Error("Body of the get goal request is null")};
      const json :string = await response.body.text();
      const goals : Goal[] = JSON.parse(json);
      return goals;
    }
    catch (error : any) {
        // if (typeof error === "string") {
        //     console.log(error.toUpperCase()) 
        // } else if (error instanceof Error) {
        //     console.log(error.message) 
        // }
        console.log(error);
        //console.log('GET call failed: ', JSON.parse(error.response.json));
        return [];
    }
  }

  renderGoalsList(goals: Goal[]) {
    let goalsList: Goal[] = [];

    return goalsList.concat(goals).map(
      (goal, i) =>
        <tr key={goal.goalId}>
          <td><a href={`/goal/${goal.goalId}`}>{goal.title}</a></td>
          <td><div className="description">{goal.description.trim().split("\n")[0]}</div></td>
          <td>{new Date(goal.createdAt).toLocaleString()}</td>
        </tr>
    );
  }

  onCreate = () => {
    this.setState({ redirect: true });
  }

  renderLanding() {
    return (
      <div className="lander">
        <h2>AWS Goals App</h2>
        <hr />
        <p>This is a sample application that creates a simple CRUD (create, read, update, delete) app, and provides the foundational services, components, and plumbing needed to get a basic web application up and running. In this "goals" app, users can create goals, add descriptions, and update or remove their goals. You can get this sample application up and running in your own environment and learn more about the architecture of the app by looking at the <a className="orange-link" href="https://github.com/awslabs/aws-full-stack-template" target="_blank">github repository</a>.</p>
        <div className="button-container col-md-12">
          <a href="/signup" className="orange-link">Sign up to explore the demo</a>
        </div>
        {/* <img src={fullStack} className="img-fluid full-width" alt="Screenshot"></img> */}
      </div>);
  }

  renderHome() {
    return (
      <div className="goals">
        <h1 className="text-center">Goals</h1>
        <div className="mb-3 float-right">
          <Button variant="primary" onClick={this.onCreate}>Create new goal</Button>
        </div>
        <Table variant="dark'">
          <thead>
            <tr>
              <th>Goal name</th>
              <th>Description</th>
              <th>Date created</th>
            </tr>
          </thead>
          <tbody>
              {
                this.state.isLoading ?
                (
                  <tr><td>
                    <Spinner animation="border" className="center-spinner" />
                  </td></tr>
                ) :
                this.renderGoalsList(this.state.goals)
            }
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    let { redirect } = this.state;
    if (redirect) {
      // return <redirect push to={'/goal/'} />;
    }

    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderHome() : this.renderLanding()}
      </div>
    );
  }
}