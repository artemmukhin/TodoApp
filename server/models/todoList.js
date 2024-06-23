const mongoose = require('mongoose');

const todoListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shareKey: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('TodoList', todoListSchema);