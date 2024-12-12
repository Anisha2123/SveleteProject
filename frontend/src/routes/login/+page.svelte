<script>
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let errorMessage = '';
  let successMessage = '';

  const handleLogin = async () => {
    errorMessage = '';
    successMessage = '';

    // Validate that both email and password are filled
    if (!email || !password) {
      errorMessage = 'Please fill in all fields.';
      return;
    }

    try {
      // Make a POST request to the login API
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle unsuccessful responses
      if (!response.ok) {
        const errorData = await response.json();
        errorMessage = errorData.message || 'Login failed. Please try again.';
        return;
      }

      // Handle successful login
      const data = await response.json();
      successMessage = 'Login successful! Redirecting...';
      console.log('Login success:', data);

      // Redirect to another page after successful login
      setTimeout(() => {
        window.location.href = '/activities';
      }, 2000);
    } catch (error) {
      // Handle unexpected errors
      console.error('Error during login:', error);
      errorMessage = 'An unexpected error occurred. Please try again.';
    }
  };
</script>

<style>
  /* Styling for error and success messages */
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

  /* Add custom font and shadow for a professional look */
  .custom-font {
    font-family: 'Inter', sans-serif;
  }

  .custom-shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 custom-font">
  <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-xl custom-shadow">
    <h2 class="text-center text-3xl font-extrabold text-gray-900 mb-6">Login to your account</h2>

    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your email"
      />
    </div>

    <div class="mb-6">
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your password"
      />
    </div>

    {#if errorMessage}
      <p class="text-sm text-red-600 mt-2">{errorMessage}</p>
    {/if}
    {#if successMessage}
      <p class="text-sm text-green-600 mt-2">{successMessage}</p>
    {/if}

    <div class="flex flex-col gap-4 mt-6">
      <button
        type="button"
        on:click={handleLogin}
        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Login
      </button>
      <button
        type="button"
        on:click={() => (window.location.href = '/signup')}
        class="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign Up
      </button>
    </div>

    <p class="mt-6 text-center text-sm text-gray-500">
      By logging in, you agree to our
      <a href="javascript:void(0)" class="text-blue-600 hover:underline">terms and conditions</a>.

    </p>
  </div>
</div>


  