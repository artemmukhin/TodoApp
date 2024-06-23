const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  state: { type: String, enum: ['TODO', 'ONGOING', 'DONE'], default: 'TODO' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  todoList: { type: mongoose.Schema.Types.ObjectId, ref: 'TodoList', required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
