<script>
  import { onMount } from 'svelte';
  import axios from 'axios';

  const API_URL = 'http://localhost:5055/api';

  let todos = [];
  let newTodo = '';

  onMount(async () => {
    await fetchTodos();
  });

  async function fetchTodos() {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      todos = response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  async function addTodo() {
    try {
      await axios.post(`${API_URL}/todos`, { title: newTodo });
      newTodo = '';
      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async function toggleTodo(id, currentState) {
    const newState = currentState === 'TODO' ? 'ONGOING' : 
                     currentState === 'ONGOING' ? 'DONE' : 'ONGOING';
    try {
      await axios.put(`${API_URL}/todos/${id}`, { state: newState });
      await fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
</script>

<main>
  <h1>Todo List</h1>
  
  <div>
    <input bind:value={newTodo} placeholder="Add a new todo" />
    <button on:click={addTodo}>Add Todo</button>
  </div>

  <ul>
    {#each todos as todo (todo._id)}
      <li>
        <span>{todo.title} - {todo.state}</span>
        <button on:click={() => toggleTodo(todo._id, todo.state)}>
          {todo.state === 'DONE' ? '✓' : '○'}
        </button>
        <button on:click={() => deleteTodo(todo._id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>