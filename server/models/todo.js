const mongoose = require('mongoose').set('strictQuery', true);

const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    state: {
        type: String,
        enum: ['TODO', 'ONGOING', 'DONE'],
        default: 'TODO',
        validate: {
            validator: async function (newState) {
                if (this.isNew) return true;
                const old = await mongoose.models.Todo.findById(this.id)
                const validTransitions = {
                    'TODO': ['ONGOING'],
                    'ONGOING': ['DONE', 'TODO'],
                    'DONE': ['ONGOING'],
                };
                return validTransitions[old.state] && validTransitions[old.state].includes(newState);
            },
            // Update the validation message to accurately reflect the allowed transitions
            message: props => `${props.value} is not a valid state transition. Allowed transitions are TODO -> ONGOING, ONGOING -> DONE/TODO, DONE -> ONGOING.`
        }
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    todoList: {type: mongoose.Schema.Types.ObjectId, ref: 'TodoList', required: true},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Todo', todoSchema);
