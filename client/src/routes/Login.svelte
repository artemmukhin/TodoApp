<script>
  import { navigate } from 'svelte-routing';
  import { authenticateUser } from '../api.js';
  import { user } from '../stores.js';

  let username = '';
  let password = '';
  let errorMessage = '';

  async function handleSubmit() {
    try {
      const response = await authenticateUser({ username, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        user.set({ isAuthenticated: true, token: response.token, username: username });
        navigate('/');
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }
</script>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
    margin: auto;
  }

  input, button {
    padding: 0.5rem;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  .error {
    color: red;
  }
</style>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Login</h2>
  <label for="username">Username</label>
  <input id="username" type="text" bind:value={username} required>
  <label for="password">Password</label>
  <input id="password" type="password" bind:value={password} required>
  <button type="submit">Login</button>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
</form>
