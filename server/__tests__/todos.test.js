const request = require('supertest');
const express = require('express');
const todosRouter = require('../routes/todos');
const User = require('../models/user');
const TodoList = require('../models/todoList');
const Todo = require('../models/todo');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/todos', todosRouter);

describe('Todos Routes Test', () => {
    let user, todoList, token;

    beforeEach(async () => {
        user = new User({
            username: 'todouser',
            password: 'todopassword'
        });
        await user.save();

        todoList = new TodoList({
            name: 'Test List',
            shareKey: 'testkey',
            users: [user._id]
        });
        await todoList.save();

        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    });

    it('should create a new todo', async () => {
        const res = await request(app)
            .post('/todos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Todo',
                todoListId: todoList._id
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('Test Todo');
        expect(res.body.state).toBe('TODO');
    });

    it('should get todos for a todo list', async () => {
        const todo = new Todo({
            title: 'Existing Todo',
            createdBy: user._id,
            todoList: todoList._id
        });
        await todo.save();

        const res = await request(app)
            .get(`/todos/${todoList._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Existing Todo');
    });

    it('should update a todo state', async () => {
        const todo = new Todo({
            title: 'Update Todo',
            createdBy: user._id,
            todoList: todoList._id
        });
        await todo.save();

        const res = await request(app)
            .put(`/todos/${todo._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                state: 'ONGOING'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.state).toBe('ONGOING');
    });

    it('should delete a todo', async () => {
        const todo = new Todo({
            title: 'Delete Todo',
            createdBy: user._id,
            todoList: todoList._id
        });
        await todo.save();

        const res = await request(app)
            .delete(`/todos/${todo._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('TODO deleted successfully');

        const deletedTodo = await Todo.findById(todo._id);
        expect(deletedTodo).toBeNull();
    });

    // Test case for GET /user route to ensure it returns todos for the authenticated user
    it('should get todos for the authenticated user', async () => {
        const res = await request(app)
            .get('/todos/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);

        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "name": "Test List"
            })
        ]));
    });
});
