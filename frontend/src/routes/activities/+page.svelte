<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';

  interface Activity {
    action: string;
    timestamp: string;
    ip_address: string;
  }

  let activities: Activity[] = [];
  let imageMap: Record<string, string> = {
    login: 'https://via.placeholder.com/40?text=L', // Replace with actual login icon URL
    logout: 'https://via.placeholder.com/40?text=O', // Replace with actual logout icon URL
    signup: 'https://via.placeholder.com/40?text=S', // Replace with actual signup icon URL
  };

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:3000/api/activities');
      if (!res.ok) {
        console.error('Failed to fetch activities');
        return;
      }

      const data = await res.json();
      activities = data.activities;
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  });

  function navigateTo(url: string) {
    window.location.href = url;
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 pt-20 px-6">

  <!-- Navbar -->
  <nav class="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-xl font-semibold">Your Dashboard</div>
      <div class="space-x-4">
        <button
          class="px-4 py-2 text-sm font-medium bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition"
          on:click={() => navigateTo('/update-profile')}
        >
          Profile
        </button>
        <button
          class="px-4 py-2 text-sm font-medium bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition"
          on:click={() => navigateTo('/signup')}
        >
          Sign Up with a Different Account
        </button>
        <button
          class="px-4 py-2 text-sm font-medium bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition"
          on:click={() => navigateTo('/login')}
        >
          Logout
        </button>
      </div>
    </div>
  </nav>

  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mt-12">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-6">
      <h1 class="text-4xl font-bold tracking-wide">Activity Dashboard</h1>
      <p class="mt-2 text-base font-light opacity-80">Monitor user activities with detailed logs</p>
    </div>

    <!-- Table Section -->
    <div class="overflow-x-auto relative">
      <table class="min-w-full bg-white divide-y divide-gray-200">
        <!-- Table Head -->
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Action
            </th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Date & Time
            </th>
            <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              IP Address
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-100">
          {#each activities as activity}
            <tr class="hover:bg-teal-50 transition duration-200 cursor-pointer">
              <!-- Action Column -->
              <td class="px-6 py-5 flex items-center gap-4 text-sm text-gray-800">
                <img
                  src={imageMap[activity.action.toLowerCase()] || 'https://via.placeholder.com/40?text=A'}
                  alt={activity.action}
                  class="w-10 h-10 object-cover rounded-full shadow-md"
                />
                <span>{activity.action}</span>
              </td>

              <!-- Date & Time Column -->
              <td class="px-6 py-5 text-sm text-gray-600">
                {new Date(activity.timestamp).toLocaleString()}
              </td>

              <!-- IP Address Column -->
              <td class="px-6 py-5 text-sm text-gray-600 font-mono">
                {activity.ip_address}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Footer Section -->
    <div class="px-8 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
      <div class="text-sm text-gray-500">Showing 1-10 of {activities.length} activities</div>
      <div class="space-x-2 mt-4 sm:mt-0">
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          on:click={() => navigateTo('/previous')}
        >
          Previous
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          on:click={() => navigateTo('/next')}
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>

