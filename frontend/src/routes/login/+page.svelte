<script>
  let email = '';
  let password = '';
  const handleLogin = () => {
    // Your login logic here
  };
</script>

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
  <button
    type="button"
    on:click={handleLogin}
    class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
  >
    Login
  </button>
</form>

  