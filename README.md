# Collaborative TODO app

Collaborative TODO app. 90% of the code is written by LLMs.

## How to run server
To run TodoApp server locally, you need to have Docker, Node.js, and npm installed on your machine.
After cloning the repository, navigate to the `server` directory and run the following commands:

1. Run MongoDB using Docker:
   ```
   docker run --name mongodb -d -p 27017:27017 mongo:latest
   ```
2. Install dependencies:
   ```
   npm install
   ```

3. Run server:
   ```
   npm start
   ```

You should see the following output:
```
Server running on port 5055
Connected to MongoDB
```

To run tests, use:
```
npm test
```

This will execute all tests defined in the `server/__tests__` directory using Jest.


## How to run client

The TodoApp client has been developed using Svelte and Electron, providing a UI for managing TODO lists collaboratively.
The client application integrates with the server to authenticate users and manage TODO lists, ensuring data is kept in sync across different instances of the application.

To run TodoApp client locally, you need to have and npm installed on your machine.
After cloning the repository, navigate to the `client` directory and run the following commands:

1. Install the necessary dependencies:
   ```
   npm install
   ```
2. To start the Electron app in development mode, run:
   ```
   npm run dev && npm run start
   ```
