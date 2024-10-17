# Goal Setting App

This project is a goal-setting application that helps users create, manage, and track their goals. The front-end is built with **React** , managed using **npm**, while the back-end is powered by **AWS Amplify** and connected to an **API Gateway** for handling API requests and responses.

See the demo version: https://main.dhzndzwhznvg2.amplifyapp.com/

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [AWS Amplify Setup](#aws-amplify-setup)
6. [Running the App](#running-the-app)

## Features

- **User Authentication**: Secure authentication using AWS Amplify’s Auth module.
- **Goal CRUD**: Users can set and update their goals.
- **Responsive UI**: Fully responsive front-end for desktop and mobile.

## Tech Stack

- **Front-end**: React, TypeScript, CSS
- **Back-end**: AWS Amplify, API Gateway, AWS Lambda
- **API Management**: AWS API Gateway, Lambda
- **Data Storage**: AWS S3
- **Authentication**: AWS Amplify Auth

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)
- **AWS Amplify CLI** (for backend deployment)
  - Install using: `npm install -g @aws-amplify/cli`
- AWS account configured in your environment

## Installation

1. **Clone the repository**:
   ```bash
      git clone https://github.com/minhtuan542002/goal-setting-app.git
      cd goal-setting-app
   ```
2. **Install dependencies and Set up AWS Amplify**:
   ```bash
      npm install
      amplify init
      amplify push
   ```

## AWS Amplify Setup
AWS Amplify is used for user authentication, API connections, and data storage.

**Auth Module:** Handles user sign-up, sign-in, and sign-out processes.

```bash
   amplify add auth
```
**API Setup:** The API is managed via AWS API Gateway and connected to a Lambda function for handling requests.

```bash
   amplify add api
```
Run amplify push after adding each of these features to deploy changes to the AWS backend.

## Running the App
Once everything is set up, you can run the development server with:
```bash
   npm start
```
This will run the app in development mode on http://localhost:3000. The app will reload if you make changes to the code.
