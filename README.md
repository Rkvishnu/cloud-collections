`React Collections management application`

The React Collection Manager App is a single-page web application that allows users to manage collection items. It leverages AWS services such as API Gateway, SQS, Lambda, and My-SQL RDS to handle CRUD (Create, Read, Update, Delete) operations and enable asynchronous processing.

## Functionality

The React Collection Manager App provides the following features:

- Collection management: Users can create, view, update, and delete their collection items.
- Asynchronous processing: After a successful collection item creation or update, additional processing is performed asynchronously using SQS and Lambda functions.

## Technology

React + materialUI – for the basic user interface
NodeJS + Express – for the REST APIs
MySQL and Sequelize – for the database layer


`Architecture`

 The application follows a client-server architecture with the following components:

- `Frontend`: The React app built using modern web technologies like React and materialUI . It handles user interactions, displays data, and makes API requests to the backend.

- `Backend`: The backend is composed of AWS services:

- API Gateway: Serves as the RESTful API endpoint for the frontend, allowing communication between the frontend and backend Lambda functions.
- Lambda Functions: AWS Lambda functions handle the CRUD operations and interact with the MySQL-RDS database.
- SQS: Simple Queue Service is used for asynchronous processing. After successful collection item creation or update, Lambda functions publish messages to an SQS queue.
- RDS: Relational Database Service is used to store and manage collection item data.

Here's an overview of the flow:

The frontend sends HTTP requests to API Gateway endpoints.
API Gateway routes the requests to the corresponding Lambda functions.
Lambda functions perform the requested CRUD operations on the RDS database.
After a successful collection item creation or update, Lambda functions publish messages to an SQS queue.
Separate Lambda functions process the messages in the SQS queue asynchronously.


![AWS Interactions](https://github.com/Rkvishnu/cloud-collections/raw/main/aws-interactions.png)

