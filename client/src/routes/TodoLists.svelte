<script>
  import { onMount } from 'svelte';
  import { fetchTodoLists, fetchTodoItems, createTodo, updateTodoState } from '../api';
  import { todoLists, user } from '../stores.js';

  async function addTodoItem(todoList) {
    if (todoList.newTitle.trim() === '') return;
    try {
      const newTodo = await createTodo(todoList._id, todoList.newTitle);
      const listIndex = $todoLists.findIndex(list => list._id === todoList._id);
      if (listIndex !== -1) {
        $todoLists[listIndex].items.push(newTodo);
        todoLists.set($todoLists);
      }
      todoList.newTitle = ''; // Clear the newTitle for the todoList after adding the item
    } catch (error) {
      console.error('Failed to add todo item:', error);
    }
  }

  async function changeTodoState(todoId, newState) {
    try {
      await updateTodoState(todoId, newState);
      const listIndex = $todoLists.findIndex(list => list.items.some(item => item._id === todoId));
      if (listIndex !== -1) {
        const itemIndex = $todoLists[listIndex].items.findIndex(item => item._id === todoId);
        if (itemIndex !== -1) {
          $todoLists[listIndex].items[itemIndex].state = newState;
          todoLists.set($todoLists);
        }
      }
    } catch (error) {
      console.error('Failed to update todo state:', error);
    }
  }

  onMount(async () => {
    try {
      const response = await fetchTodoLists();
      response.forEach(list => list.newTitle = '');
      todoLists.set(response);
      console.log($todoLists)
      for (const todoList of $todoLists) {
        const todoItems = await fetchTodoItems(todoList._id);
        console.log(todoItems)
        todoList.items = todoItems;
      }
      todoLists.set(response);
    } catch (error) {
      console.error('Failed to fetch todo lists:', error);
    }
  });
</script>

<style>
  :global(body) {
    font-family: 'Roboto', sans-serif;
    background-color: #f0f2f5;
    color: #333;
  }

  .todo-lists {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    max-width: 800px;
    margin: auto;
  }

  .todo-form {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .todo-form input, .todo-form button {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .todo-form button {
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .todo-form button:hover {
    background-color: #0056b3;
  }

  .state-selector {
    padding: 0.3rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-left: 1rem;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }

  .state-selector:hover {
    border-color: #007bff;
  }

  @media (max-width: 768px) {
    .todo-lists {
      padding: 1rem;
    }

    .todo-form {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>

{#if $todoLists}
  {#each $todoLists as todoList}
    <div>
      <h2>{todoList.name}</h2>
      <p>Share key: {todoList.shareKey}</p>
      <form class="todo-form" on:submit|preventDefault={() => addTodoItem(todoList)}>
        <input type="text" bind:value={todoList.newTitle} placeholder="New todo title" />
        <button type="submit">Add Todo</button>
      </form>
      {#if todoList.items}
        <ul>
          {#each todoList.items as item}
            <li>
              {item.title} - {item.state}
              <select class="state-selector" on:change={(event) => changeTodoState(item._id, event.target.value)}>
                <option value="" disabled selected>Change State</option>
                <option value="TODO">TODO</option>
                <option value="ONGOING">ONGOING</option>
                <option value="DONE">DONE</option>
              </select>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
{/if}
