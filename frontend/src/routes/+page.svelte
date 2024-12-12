
<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // Redirect to /login on page load
    onMount(() => {
        goto('/login');
    });
</script>
