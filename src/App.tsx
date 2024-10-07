import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
//import { Form, Nav, Navbar} from "react-bootstrap";
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { withAuthenticator, Heading, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import { type AuthUser, fetchAuthSession } from "aws-amplify/auth";
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
import Home from "./Home";
import AddEditGoal from './AddEditGoal';
 

type AppProps = {
  signOut?: UseAuthenticator["signOut"];
  user?: AuthUser;
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  return (
    <div className="App">
      {/* <div style={styles.navbar}> */}
        {/* <div>
          <Navbar.Brand style={styles.navbutton} href="/">Home</Navbar.Brand>
        </div> */}
      <div style = {styles.container}>
        <Heading level={3}>Hello {user?.username}</Heading>
        <Button style={styles.signOut} onClick={signOut}>Sign out</Button>
      </div>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home isAuthenticated={true} />} />
            <Route path="/goal/:id?" element={<AddEditGoal />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    gap: 10,
    backgroundColor: "white",
  },
  signOut:{
    margin: "10 auto"
  },
  navbar: {
    display: "inline-flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

} as const;
export default withAuthenticator(App);
