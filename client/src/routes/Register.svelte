<script>
  import { registerUser } from '../api.js';
  import {navigate} from "svelte-routing";

  let username = '';
  let password = '';

  async function handleSubmit() {
    try {
      const response = await registerUser({ username, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('login');
      }
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
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
</style>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Register</h2>
  <label for="username">Username</label>
  <input id="username" type="text" bind:value={username} required>
  <label for="password">Password</label>
  <input id="password" type="password" bind:value={password} required>
  <button type="submit">Register</button>
</form>
