# Running Tests for TodoApp

## Running Tests Locally

To run tests locally, you need to have Node.js and npm installed on your machine. After cloning the repository, navigate to the `server` directory and run the following commands:

1. Install dependencies:
   ```
   npm install
   ```

2. Run tests:
   ```
   npm test
   ```

This will execute all tests defined in the `server/__tests__` directory using Jest.

## Viewing Test Results on GitHub Actions

Test results can be viewed directly on GitHub under the "Actions" tab of the repository. Each push or pull request to the main branch triggers the GitHub Actions workflow defined in `.github/workflows/node.js.yml`, which runs the tests. The results of these tests, including any failures, will be displayed in the workflow run summary.

## Setting Up Local Environment Variables for Testing

Before running tests, especially those that interact with external services like databases, you might need to set up environment variables. Create a `.env` file in the `server` directory with the necessary variables. For example:

```
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your_jwt_secret
```

Replace `your_jwt_secret` with a secure, random string. This file should not be committed to version control to keep sensitive information like secrets and database URIs secure.

## Troubleshooting Jest Tests

When running Jest tests, you might encounter a warning indicating that Jest did not exit one second after the test run has completed. This usually means that there are asynchronous operations that weren't stopped in your tests. To troubleshoot this issue, consider running Jest with the `--detectOpenHandles` flag. This flag helps identify potential issues with asynchronous operations not being properly closed. Additionally, ensure that any setup or teardown processes in your tests, such as connections to databases or external services, are properly closed after the tests complete.
