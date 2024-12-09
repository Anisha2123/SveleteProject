<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let message = '';

  async function handleSignup(event: SubmitEvent) {
      event.preventDefault();
      try {
          const response = await fetch('http://localhost:3000/api/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();
          if (response.ok) {
              message = 'Signup successful! Redirecting to login...';
              setTimeout(() => {
                  goto('/login');
              }, 2000); // Redirect after 2 seconds to show the success message
          } else {
              message = data.message || 'An error occurred. Please try again.';
          }
      } catch (error) {
          message = 'An error occurred. Please try again.';
      }
  }
</script>

<style>
  /* Styling for error and success messages */
  .message {
      font-size: 0.9rem;
      margin-top: 10px;
  }

  .error {
      color: red;
  }

  .success {
      color: green;
  }

  /* Add custom font and shadow for a professional look */
  .custom-font {
      font-family: 'Inter', sans-serif;
  }

  .custom-shadow {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-100 custom-font">
  <div class="bg-white p-8 rounded-lg shadow-xl custom-shadow w-full max-w-md">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
      {#if message}
          <p class="message {message.includes('successful') ? 'success' : 'error'} text-center">{message}</p>
      {/if}
      <form on:submit|preventDefault={handleSignup} class="space-y-6">
          <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                  id="name"
                  type="text"
                  bind:value={name}
                  placeholder="Enter your name"
                  required
                  class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
          </div>
          <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                  id="email"
                  type="email"
                  bind:value={email}
                  placeholder="Enter your email"
                  required
                  class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
          </div>
          <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <input
                  id="password"
                  type="password"
                  bind:value={password}
                  placeholder="Enter your password"
                  required
                  class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
          </div>
          <div class="flex flex-col gap-4">
              <button
                  type="submit"
                  class="w-full py-3 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                  Sign Up
              </button>
              <button
                  type="button"
                  on:click={() => goto('/login')}
                  class="w-full py-3 px-4 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                  Login
              </button>
          </div>
      </form>
  </div>
</main>
