<script>
    import {writable} from 'svelte/store';
    import Home from './routes/Home.svelte';
    import TodoLists from './routes/TodoLists.svelte';
    import Register from './routes/Register.svelte';
    import Login from './routes/Login.svelte'; // Import Login component
    import {user, todoLists} from './stores.js';
    import {navigate, Router, Link, Route} from 'svelte-routing';

    // User authentication state
    let isAuthenticated = writable(false);

    // Check currentUser authentication status
    $: if ($user) {
        isAuthenticated.set(true);
    } else {
        isAuthenticated.set(false);
    }

    navigate('/')

    // Function to handle logout
    function logout() {
        user.set(null);
        navigate('/');
    }
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background-color: #f5f5f5;
    }

    nav a {
        margin-right: 1rem;
    }
</style>

<Router>
    <Route path="/">
        <Home/>
    </Route>
    <Route path="todolists">
        <TodoLists/>
    </Route>
    <Route path="register">
        <Register/>
    </Route>
    <Route path="login">
        <Login/>
    </Route>

    <header>
        <nav>
            <Link to="/">Home</Link>
            {#if $isAuthenticated}
                <Link to="todolists">Todo Lists</Link>
                <button on:click={logout}>Logout</button>
            {/if}
            {#if !$isAuthenticated}
                <Link to="register">Register</Link>
                <Link to="login">Login</Link> <!-- Add link to login page -->
            {/if}
        </nav>
    </header>
</Router>

