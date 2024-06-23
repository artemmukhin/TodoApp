const express = require('express');
const Todo = require('../models/todo');
const TodoList = require('../models/todoList');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, todoListId } = req.body;
    const todo = new Todo({
      title,
      createdBy: req.user.userId,
      todoList: todoListId
    });
    await todo.save();
    
    console.log("TODO created: " + todo.title)
    res.status(201).json(todo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create TODO' });
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { shareKey } = req.body;
    const todoList = await TodoList.findOne({ shareKey });
    if (!todoList) {
      return res.status(404).json({ error: 'TODO list not found' });
    }
    if (todoList.users.includes(req.user.userId)) {
      return res.status(400).json({ error: 'User already a member of this TODO list' });
    }
    todoList.users.push(req.user.userId);
    await todoList.save();
    res.status(200).json({ message: 'Successfully joined the TODO list', todoListId: todoList._id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to join TODO list' });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const todos = await TodoList.find({ users: { $in: [req.user.userId] } });
    console.log("TODOS: " + todos)
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch TODOs' });
  }
});

router.get('/:todoListId', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ todoList: req.params.todoListId }).populate('createdBy', 'username');
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch TODOs' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { state } = req.body;
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }

    todo.state = state;
    todo.updatedAt = Date.now();
    await todo.save();
    
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update TODO' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    
    res.json({ message: 'TODO deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete TODO' });
  }
});

module.exports = router;
