
<script lang="ts">
    import { page } from '$app/stores';
    let name = '';
    let email = '';
    let password = '';
    let message = '';
  
    async function handleSignup(event: SubmitEvent) {
      event.preventDefault();
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          message = 'Signup successful! Please log in.';
        } else {
          message = data.error || 'An error occurred. Please try again.';
        }
      } catch (error) {
        message = 'An error occurred. Please try again.';
      }
    }
  </script>
  
  <main class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      {#if message}
        <p class="mb-4 text-center text-red-500">{message}</p>
      {/if}
      <form on:submit|preventDefault={handleSignup} class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            bind:value={name}
            placeholder="Enter your name"
            required
            class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  </main>
  