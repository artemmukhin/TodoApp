const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  state: {
    type: String,
    enum: ['TODO', 'ONGOING', 'DONE'],
    default: 'TODO',
    validate: {
      validator: function(v) {
        if (this.isNew) return true; // Allow any initial state
        const validTransitions = {
          'TODO': ['ONGOING'],
          'ONGOING': ['DONE', 'TODO'],
          'DONE': ['ONGOING']
        };
        return validTransitions[this.state] && validTransitions[this.state].includes(v);
      },
      message: props => `${props.value} is not a valid state transition from ${this.state}`
    }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  todoList: { type: mongoose.Schema.Types.ObjectId, ref: 'TodoList', required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);