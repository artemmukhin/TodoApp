const express = require('express');
const Todo = require('../models/todo');
const authMiddleware = require('../middleware/authMiddleware');
const { io } = require('../server');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { title, todoListId } = req.body;
    const todo = new Todo({
      title,
      createdBy: req.user.userId,
      todoList: todoListId
    });
    await todo.save();
    
    // io.to(todoListId).emit('todoCreated', todo);
    console.log("TODO created: " + todo.title)
    res.status(201).json(todo);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create TODO' });
  }
});

router.get('/:todoListId', async (req, res) => {
  try {
    const todos = await Todo.find({ todoList: req.params.todoListId }).populate('createdBy', 'username');
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch TODOs' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { state } = req.body;
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    
    const stateTransition = {
      TODO: 'ONGOING',
      ONGOING: 'DONE',
      DONE: 'ONGOING'
    };
    
    if (stateTransition[todo.state] !== state) {
      return res.status(400).json({ error: 'Invalid state transition' });
    }
    
    todo.state = state;
    todo.updatedAt = Date.now();
    await todo.save();
    
    io.to(todo.todoList.toString()).emit('todoUpdated', todo);
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update TODO' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    
    io.to(todo.todoList.toString()).emit('todoDeleted', todo._id);
    res.json({ message: 'TODO deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete TODO' });
  }
});

module.exports = router;
