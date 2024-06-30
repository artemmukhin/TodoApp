const TodoList = require('../models/todoList');
const mongoose = require('mongoose');

describe('TodoList Model Test', () => {
    it('should create & save todoList successfully', async () => {
        const todoListData = {
            name: 'Test List',
            shareKey: 'testkey123',
            users: [new mongoose.Types.ObjectId()]
        };
        const todoList = new TodoList(todoListData);
        const savedTodoList = await todoList.save();

        expect(savedTodoList._id).toBeDefined();
        expect(savedTodoList.name).toBe(todoListData.name);
        expect(savedTodoList.shareKey).toBe(todoListData.shareKey);
        expect(savedTodoList.users).toHaveLength(1);
    });

    it('should fail to create todoList without required fields', async () => {
        const todoList = new TodoList({});
        let err;
        try {
            await todoList.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });
});