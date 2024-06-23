import { writable } from 'svelte/store';

// Store for managing the current user's state. Includes token handling for authentication
export const user = writable({
  isAuthenticated: false,
  token: null,
  username: null,
  login: (token, username) => {
    user.update(current => {
      return { ...current, isAuthenticated: true, token, username };
    });
  },
  logout: () => {
    user.set({ isAuthenticated: false, token: null, username: null });
  }
});

export const todoLists = writable([]);
