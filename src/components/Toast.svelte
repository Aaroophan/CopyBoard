<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { toastStore } from '../stores/toastStore';
  
  $: typeClasses = {
    success: 'bg-success-500 text-white',
    error: 'bg-error-500 text-white',
    warning: 'bg-warning-500 text-white',
    info: 'bg-primary-500 text-white',
  }[$toastStore.type] || 'bg-primary-500 text-white';
  
  $: iconName = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'exclamation',
    info: 'information-circle',
  }[$toastStore.type] || 'information-circle';
</script>

{#if $toastStore.visible}
  <div 
    class="fixed bottom-4 right-4 z-50"
    in:fly={{ y: 20, duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <div class={`rounded-lg shadow-lg px-4 py-3 flex items-center ${typeClasses}`}>
      <div class="mr-3">
        {#if iconName === 'check-circle'}
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {:else if iconName === 'x-circle'}
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {:else if iconName === 'exclamation'}
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        {:else}
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        {/if}
      </div>
      <div>{$toastStore.message}</div>
    </div>
  </div>
{/if}