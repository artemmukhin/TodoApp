<script>
    import { Router, Link, Route } from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import Register from "./routes/Register.svelte";
    import TodoLists from "./routes/TodoLists.svelte";
    import TodoList from "./routes/TodoList.svelte";
  
    export let url = "";
  </script>
  
  <Router {url}>
    <nav>
      <Link to="/">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/todo-lists">Todo Lists</Link>
    </nav>
  
    <main>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/todo-lists" component={TodoLists} />
      <Route path="/todo-list/:id" component={TodoList} />
    </main>
  </Router>
  
  <style>
    main {
      padding: 1em;
      max-width: 800px;
      margin: 0 auto;
    }
    nav {
      padding: 1em;
      background-color: #f0f0f0;
    }
    nav a {
      margin-right: 1em;
    }
  </style>