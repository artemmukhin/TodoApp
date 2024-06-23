const PORT = process.env.PORT || 5055;
const API_BASE_URL = `http://localhost:${PORT}/api`;

async function authenticateUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Failed to authenticate user');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to register user');
  }
  return response.json();
}

async function fetchTodoLists() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/todos/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch todo lists');
  }
  return response.json();
}

async function createTodoList(name) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/auth/create-todo-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo list');
  }
  return response.json();
}

async function joinTodoList(shareKey) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/todos/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ shareKey }),
  });
  if (!response.ok) {
    throw new Error('Failed to join todo list');
  }
  return response.json();
}

async function createTodo(todoListId, title, description) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ todoListId, title, description }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
}

async function updateTodoState(todoId, state) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update todo state. Error: ${response.statusText}`);
  }
  return response.json();
}

async function fetchTodoItems(todoListId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/todos/${todoListId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include authorization header with the token
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch todo items');
  }
  return response.json();
}

export { authenticateUser, registerUser, fetchTodoLists, createTodoList, joinTodoList, createTodo, updateTodoState, fetchTodoItems };
