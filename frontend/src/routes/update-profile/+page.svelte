<script lang="ts">
  import { writable } from 'svelte/store';

  let userName = writable('John Doe');
  let profilePicture = writable('/default-avatar.png');
  let email = writable('johndoe@example.com');
  let currentPassword = '';
  let newPassword = '';
  let newEmail = '';
  let message = '';
  let passwordFieldDisabled = true;
  let emailError = '';
  let passwordError = '';

  // Handle profile picture upload
  function handleProfilePictureUpload(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        profilePicture.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Form submission for current password validation
  async function validateCurrentPassword(event: SubmitEvent) {
    event.preventDefault();
    if (!currentPassword) {
      passwordError = 'Please enter your current password.';
      return;
    }
    passwordFieldDisabled = false;
    message = '';
    passwordError = '';
  }

  // Handle password reset
  async function resetPassword(event: SubmitEvent) {
    event.preventDefault();
    if (!newPassword) {
      message = 'Please enter a new password.';
      return;
    }
    message = 'Password reset successful!';
  }

  // Handle email update
  async function updateEmail(event: SubmitEvent) {
    event.preventDefault();
    if (!newEmail) {
      emailError = 'Please enter your new email.';
      return;
    }
    email = writable(newEmail);
    message = 'Email updated successfully!';
    emailError = '';
  }

  // Placeholder function to update the username
  function updateUserName(event: Event & { currentTarget: EventTarget & HTMLInputElement; }) {
    // Update username logic
  }
</script>

<style>
  .container {
    @apply max-w-7xl mx-auto px-4 py-6;
  }

  .section-title {
    @apply text-3xl font-semibold text-gray-900;
  }

  .input-field {
    @apply w-full py-2 px-3 border rounded-md text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out;
  }

  .button-primary {
    @apply w-32 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500;
  }

  .button-secondary {
    @apply w-32 py-2 px-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500;
  }

  .avatar-input {
    @apply mt-2 text-indigo-600 cursor-pointer;
  }

  .error-message {
    @apply text-red-500 text-sm mt-1;
  }

  .message {
    @apply text-center text-green-500 mt-4;
  }

  /* Landscape Layout */
  .profile-card {
    @apply flex items-center justify-between bg-white rounded-lg shadow-xl p-8 space-x-8;
  }

  .avatar-container {
    @apply w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-600;
  }

  .avatar-img {
    @apply w-full h-full object-cover;
  }

  .form-card {
    @apply w-full max-w-md space-y-6;
  }

  .form-section {
    @apply mb-6;
  }

  .tabs {
    @apply flex border-b border-gray-300;
  }

  .tab-item {
    @apply py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-200 rounded-t-md;
  }

  .tab-item-active {
    @apply border-b-2 border-indigo-600 text-indigo-600;
  }

  .form-section-title {
    @apply text-xl font-semibold text-gray-900;
  }
</style>

<main class="min-h-screen bg-gray-50 flex justify-center items-center">
  <div class="container">
    <!-- Profile Card -->
    <div class="profile-card">
      <!-- Avatar Section -->
      <div class="avatar-container">
        <img src={$profilePicture} alt="Profile Picture" class="avatar-img" />
      </div>
      <div>
        <input
          type="file"
          accept="image/*"
          on:change={handleProfilePictureUpload}
          class="avatar-input mt-4"
        />
      </div>

      <!-- Form Section -->
      <div class="form-card">
        <h1 class="section-title mb-6">Profile Information</h1>

        <!-- Username -->
        <div class="form-section">
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" bind:value={$userName} class="input-field mt-2" placeholder="Enter your username" />
        </div>

        <!-- Email -->
        <div class="form-section">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={$email} class="input-field mt-2" disabled />
        </div>

        <!-- Current Password -->
        <form on:submit|preventDefault={validateCurrentPassword} class="space-y-4">
          <div class="form-section">
            <label class="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              bind:value={currentPassword}
              placeholder="Enter current password"
              class="input-field mt-2"
            />
            {#if passwordError}
              <p class="error-message">{passwordError}</p>
            {/if}
          </div>
          <button type="submit" class="button-primary mt-4">Validate Current Password</button>
        </form>

        {#if !passwordFieldDisabled}
          <form on:submit|preventDefault={resetPassword} class="space-y-4 mt-6">
            <div class="form-section">
              <label class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                bind:value={newPassword}
                placeholder="Enter new password"
                class="input-field mt-2"
              />
            </div>
            <button type="submit" class="button-primary mt-4">Reset Password</button>
          </form>
        {/if}

        <!-- Update Email -->
        <form on:submit|preventDefault={updateEmail} class="space-y-4 mt-6">
          <div class="form-section">
            <label class="block text-sm font-medium text-gray-700">New Email</label>
            <input
              type="email"
              bind:value={newEmail}
              placeholder="Enter new email"
              class="input-field mt-2"
            />
            {#if emailError}
              <p class="error-message">{emailError}</p>
            {/if}
          </div>
          <button type="submit" class="button-secondary mt-4">Update Email</button>
        </form>

        <!-- Feedback Message -->
        {#if message}
          <div class="message">{message}</div>
        {/if}
      </div>
    </div>
  </div>
</main>

