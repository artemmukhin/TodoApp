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
});