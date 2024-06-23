const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const User = require('../models/user');
const TodoList = require('../models/todoList');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes Test', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                username: 'testuser',
                password: 'testpassword'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');
    });

    it('should login an existing user', async () => {
        const user = new User({
            username: 'existinguser',
            password: 'existingpassword'
        });
        await user.save();

        const res = await request(app)
            .post('/auth/login')
            .send({
                username: 'existinguser',
                password: 'existingpassword'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');
    });

    it('should create a new todo list', async () => {
        const user = new User({
            username: 'todolistuser',
            password: 'todolistpassword'
        });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const res = await request(app)
            .post('/auth/create-todo-list')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Todo List'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('todoListId');
        expect(res.body).toHaveProperty('shareKey');
    });

    it('should join an existing todo list', async () => {
        const user = new User({
            username: 'joinuser',
            password: 'joinpassword'
        });
        await user.save();

        const todoList = new TodoList({
            name: 'Existing List',
            shareKey: 'existingkey',
            users: []
        });
        await todoList.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const res = await request(app)
            .post('/auth/join-todo-list')
            .set('Authorization', `Bearer ${token}`)
            .send({
                shareKey: 'existingkey'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('todoListId');
    });

    it('should return an error for missing Authorization header', async () => {
        const user = new User({
            username: 'missingAuthUser',
            password: 'missingAuthPassword'
        });
        await user.save();

        const res = await request(app)
            .post('/auth/create-todo-list')
            .send({
                name: 'Test Todo List'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Authorization header missing');
    });

    it('should return an error for invalid token', async () => {
        const token = 'invalidtoken'; // Using an hardcoded invalid token string, you can replace it with the way you want to generate an invalid token

        const res = await request(app)
            .post('/auth/create-todo-list')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Todo List'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Invalid token'); // Replace 'Invalid token' with the specific error message your application sends when it encounters an invalid token
    });

    it('should return an error for duplicate username on registration', async () => {
        // first, register a new user
        const res1 = await request(app)
            .post('/auth/register')
            .send({
                username: 'duplicateuser',
                password: 'testpassword'
            });

        // then, attempt to register again with the same username
        const res2 = await request(app)
            .post('/auth/register')
            .send({
                username: 'duplicateuser',
                password: 'testpassword'
            });

        // the server should respond with an error message or code indicating that registration failed due to a duplicate username
        expect(res2.statusCode).toBe(400); // or whatever status code your API sends for failed registration
        expect(res2.body).toHaveProperty('error');
        // you'll need to replace 'Duplicate username' with the specific error message your API sends when it encounters a duplicate username
        expect(res2.body.error).toBe('Registration failed');
    });
    it('should return an error for invalid credentials', async () => {
        // first, register a new user
        await request(app)
            .post('/auth/register')
            .send({
                username: 'validUsername',
                password: 'validPassword'
            });

        // then, attempt to login with invalid credentials
        const res = await request(app)
            .post('/auth/login')
            .send({
                username: 'invalidUsername',
                password: 'invalidPassword'
            });

        // the server should respond with an error message or code indicating that login failed due to invalid credentials
        expect(res.statusCode).toBe(401); // or whatever status code your API sends for failed login
        expect(res.body).toHaveProperty('error');
    });
});