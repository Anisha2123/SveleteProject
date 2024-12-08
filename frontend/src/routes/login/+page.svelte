

<script>
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let errorMessage = '';
  let successMessage = '';

  const handleLogin = async () => {
    errorMessage = '';
    successMessage = '';

    if (!email || !password) {
      errorMessage = 'Please fill in all fields.';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        errorMessage = errorData.message || 'Login failed. Please try again.';
        return;
      }

      const data = await response.json();
      successMessage = 'Login successful! Redirecting...';
      console.log('Login success:', data);

      // Redirect to another page after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error during login:', error);
      errorMessage = 'An unexpected error occurred. Please try again.';
    }
  };
</script>

<style>
  .error-message {
    color: red;
    margin-top: 10px;
    font-size: 0.9rem;
  }

  .success-message {
    color: green;
    margin-top: 10px;
    font-size: 0.9rem;
  }
</style>

<form class="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
  <h2 class="text-2xl font-semibold mb-6 text-center">Login</h2>
  <div class="mb-4">
    <label for="email" class="block text-gray-700">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      class="w-full p-2 border rounded-md mt-2"
      placeholder="Enter your email"
    />
  </div>
  <div class="mb-6">
    <label for="password" class="block text-gray-700">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      class="w-full p-2 border rounded-md mt-2"
      placeholder="Enter your password"
    />
  </div>
  {#if errorMessage}
    <p class="error-message">{errorMessage}</p>
  {/if}
  {#if successMessage}
    <p class="success-message">{successMessage}</p>
  {/if}
  <button
    type="button"
    on:click={handleLogin}
    class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
  >
    Login
  </button>
</form>

  