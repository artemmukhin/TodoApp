<script>
  import { onMount } from 'svelte';
  import { todoLists, user } from '../stores.js';
  import { fetchTodoLists, createTodoList, joinTodoList } from '../api.js';
  import { navigate } from 'svelte-routing';

  let newListName = '';
  let errorMessage = '';

  onMount(async () => {
    try {
      const lists = await fetchTodoLists();
      todoLists.set(lists);
    } catch (error) {
      console.error('Failed to fetch todo lists:', error);
    }
  });

  async function createList() {
    const { isAuthenticated } = $user;
    if (!isAuthenticated) {
      errorMessage = 'You must be logged in to create a list.';
      return;
    }
    try {
      const createdList = await createTodoList(newListName);
      todoLists.update(currentLists => [...currentLists, createdList]);
      navigate(`/todolist/${createdList.id}`);
    } catch (error) {
      console.error('Failed to create todo list:', error);
      errorMessage = 'Failed to create todo list. Please try again.';
    }
  }

  async function joinList() {
    try {
      const response = await joinTodoList(newListName);
      navigate("todolists");
    } catch (error) {
      errorMessage = 'Failed to join the list. Please check the share key and try again.';
    }
  }
</script>

<style>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  input {
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 10px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .error-message {
    color: red;
    margin: 10px 0;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .home-container {
      padding: 20px;
    }

    .button, button[type="submit"] {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
</style>

<div class="home-container">
  <h1>Collaborative TODO List</h1>
  <p>Enter a TODO list name to create a new list, or enter a share key to join an existing list.</p>
  <input type="text" bind:value={newListName} placeholder="Name or share key" required>
  <form on:submit|preventDefault={createList}>
    <button type="submit" class="button">Create a New List</button>
  </form>
  <button class="button" on:click={joinList}>Join an Existing List</button>
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
</div>
