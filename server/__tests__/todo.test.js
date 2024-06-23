const Todo = require('../models/todo');
const mongoose = require('mongoose').set('strictQuery', true);

describe('Todo Model Test', () => {
    it('should create & save todo successfully', async () => {
        const todoData = {
            title: 'Test Todo',
            createdBy: new mongoose.Types.ObjectId(),
            todoList: new mongoose.Types.ObjectId(),
        };
        const todo = new Todo(todoData);
        const savedTodo = await todo.save();

        expect(savedTodo._id).toBeDefined();
        expect(savedTodo.title).toBe(todoData.title);
        expect(savedTodo.state).toBe('TODO');
        expect(savedTodo.createdBy).toEqual(todoData.createdBy);
        expect(savedTodo.todoList).toEqual(todoData.todoList);
    });

    it('should fail to create todo without required fields', async () => {
        const todo = new Todo({});
        let err;
        try {
            await todo.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should only allow valid state transitions', async () => {
        const todoData = {
            title: 'Test Todo',
            createdBy: new mongoose.Types.ObjectId(),
            todoList: new mongoose.Types.ObjectId()
        };
        const todo = new Todo(todoData);
        await todo.save();

        // Valid transition: TODO -> ONGOING
        todo.state = 'ONGOING';
        await todo.save();
        expect(todo.state).toBe('ONGOING');

        // Valid transition: ONGOING -> DONE
        todo.state = 'DONE';
        await todo.save();
        expect(todo.state).toBe('DONE');

        // Invalid transition: DONE -> TODO
        todo.state = 'TODO';
        let err;
        try {
            await todo.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.state).toBeDefined();
    });
});