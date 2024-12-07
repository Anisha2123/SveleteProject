

<script>
    import { onMount } from 'svelte';
    let user = { name: '', email: '', profile_picture: '' };
    let newName = '';
    let newPassword = '';
  
    // Fetch user profile data
    onMount(async () => {
      const res = await fetch('/api/profile');  // Adjust API endpoint
      const data = await res.json();
      user = data.user;
    });
  
    // Update profile function
    const updateProfile = async () => {
      const res = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, password: newPassword })
      });
  
      const data = await res.json();
      if (data.success) {
        user.name = newName;
        newName = '';
        newPassword = '';
      } else {
        alert('Error updating profile');
      }
    };
  </script>
  
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold mb-6">Profile Management</h1>
  
    <form on:submit|preventDefault={updateProfile} class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          bind:value={newName}
          class="mt-1 block w-full p-2 border rounded-md"
          placeholder={user.name}
        />
      </div>
  
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">New Password</label>
        <input
          id="password"
          type="password"
          bind:value={newPassword}
          class="mt-1 block w-full p-2 border rounded-md"
          placeholder="Enter new password"
        />
      </div>
  
      <button
        type="submit"
        class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Update Profile
      </button>
    </form>
  
    <div class="mt-6">
      <h2 class="text-lg font-semibold">Profile Picture</h2>
      <img
        src={user.profile_picture}
        alt="Profile Picture"
        class="w-24 h-24 rounded-full mt-4"
      />
      <!-- Add logic for profile picture update -->
    </div>
  </div>
  