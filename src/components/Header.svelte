<script lang="ts">
  import { fly } from 'svelte/transition';
</script>

<header class="bg-white shadow-sm" in:fly={{ y: -20, duration: 300 }}>
  <div class="container mx-auto px-4 py-4 flex items-center justify-between">
    <div class="flex items-center">
      <svg class="w-8 h-8 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <h1 class="text-2xl font-bold text-gray-900">CopyBoard</h1>
    </div>
    <div class="text-sm text-gray-600">
      Public Digital Noticeboard
    </div>
  </div>
</header>