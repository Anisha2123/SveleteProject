
<script>
    import { onMount } from 'svelte';
    import { Chart } from 'chart.js/auto';
  
    let activities = [];
    let activityLabels = [];
    let activityData = [];
  
    // Fetch user activity data on mount
    onMount(async () => {
      const res = await fetch('/api/activities');  // Adjust API endpoint as needed
      const data = await res.json();
  
      activities = data.activities;
  
      // Prepare data for the chart
      activityLabels = activities.map(a => new Date(a.timestamp).toLocaleString());
      activityData = activities.map(a => a.action);
  
      // Generate the chart
      new Chart(document.getElementById('activityChart'), {
        type: 'line',
        data: {
          labels: activityLabels,
          datasets: [{
            label: 'User Activities',
            data: activityData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
      });
    });
  </script>
  
  <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
    <h1 class="text-2xl font-semibold text-center mb-6">Activity Dashboard</h1>
  
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left">Action</th>
            <th class="px-4 py-2 text-left">Date & Time</th>
            <th class="px-4 py-2 text-left">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {#each activities as activity}
            <tr>
              <td class="px-4 py-2">{activity.action}</td>
              <td class="px-4 py-2">{new Date(activity.timestamp).toLocaleString()}</td>
              <td class="px-4 py-2">{activity.ip_address}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  
    <!-- Activity chart -->
    <div class="mt-6">
      <canvas id="activityChart"></canvas>
    </div>
  </div>
  