const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const TodoList = require('../models/todoList');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

router.post('/create-todo-list', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    
    const shareKey = Math.random().toString(36).substring(2, 10);
    const todoList = new TodoList({ name, shareKey, users: [userId] });
    await todoList.save();
    
    await User.findByIdAndUpdate(userId, { $push: { todoLists: todoList._id } });
    
    res.status(201).json({ todoListId: todoList._id, shareKey });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create TODO list' });
  }
});

router.post('/join-todo-list', async (req, res) => {
  try {
    const { shareKey } = req.body;
    const userId = req.user.userId;
    
    const todoList = await TodoList.findOne({ shareKey });
    if (!todoList) {
      return res.status(404).json({ error: 'TODO list not found' });
    }
    
    if (!todoList.users.includes(userId)) {
      todoList.users.push(userId);
      await todoList.save();
      await User.findByIdAndUpdate(userId, { $push: { todoLists: todoList._id } });
    }
    
    res.json({ todoListId: todoList._id });
  } catch (error) {
    res.status(400).json({ error: 'Failed to join TODO list' });
  }
});

module.exports = router;