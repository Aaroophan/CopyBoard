<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { userStore } from '../stores/userStore';
  import { toastStore } from '../stores/toastStore';
  
  const dispatch = createEventDispatcher();
  
  let signature = $userStore.signature || '';
  let noteText = '';
  let isCreating = false;
  
  async function createNote() {
    if (!signature.trim()) {
      toastStore.showToast('Please enter your signature', 'warning');
      return;
    }
    
    if (!noteText.trim()) {
      toastStore.showToast('Please enter note text', 'warning');
      return;
    }
    
    isCreating = true;
    
    try {
      const response = await fetch(`http://localhost:3000/api/${signature}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: noteText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      
      // Save signature for future use
      userStore.setSignature(signature);
      
      // Clear text field
      noteText = '';
      
      dispatch('noteCreated');
      toastStore.showToast('Note created successfully!', 'success');
    } catch (error) {
      console.error('Error creating note:', error);
      toastStore.showToast('Failed to create note. Please try again.', 'error');
    } finally {
      isCreating = false;
    }
  }

  function handleClose() {
    dispatch('close');
  }
  
  $: {
    // Keep local signature in sync with store
    if ($userStore.signature && $userStore.signature !== signature) {
      signature = $userStore.signature;
    }
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6" in:fly={{ y: 20, duration: 300 }}>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold text-gray-800">Add a Note</h2>
    <button 
      class="text-gray-400 hover:text-gray-600 transition-colors"
      on:click={handleClose}
    >
      ×
    </button>
  </div>
  
  <div class="space-y-4">
    <div>
      <label for="signature" class="label">Your Signature</label>
      <input 
        type="text" 
        id="signature" 
        bind:value={signature} 
        class="input"
        placeholder="Enter your signature (name, nickname, etc.)"
        disabled={isCreating}
      />
      <p class="mt-1 text-xs text-gray-500">
        Your signature is used to identify your notes. You'll need it to edit or delete your notes later.
      </p>
    </div>
    
    <div>
      <label for="noteText" class="label">Note Content</label>
      <textarea 
        id="noteText" 
        bind:value={noteText} 
        class="textarea h-32"
        placeholder="What would you like to share?"
        disabled={isCreating}
      ></textarea>
    </div>
    
    <div class="flex justify-end">
      <button 
        class="btn btn-primary"
        on:click={createNote}
        disabled={isCreating}
      >
        {#if isCreating}
          <div class="flex items-center">
            <div class="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Creating...
          </div>
        {:else}
          Create Note
        {/if}
      </button>
    </div>
  </div>
</div>