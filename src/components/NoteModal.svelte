<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { userStore } from '../stores/userStore';
  import { toastStore } from '../stores/toastStore';
  import type { Note } from '../types';
  
  export let note: Note;
  
  const dispatch = createEventDispatcher();
  let text = note.text;
  let isEditing = false;
  let isOwner = false;
  let confirmingDelete = false;
  let textareaElement: HTMLTextAreaElement;
  
  $: isOwner = $userStore.signature === note.signature;
  
  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  function closeModal() {
    dispatch('close');
    window.history.pushState({}, '', '/');
  }
  
  function startEditing() {
    if (!isOwner) return;
    isEditing = true;
    setTimeout(() => {
      if (textareaElement) {
        textareaElement.focus();
      }
    }, 0);
  }
  
  function cancelEditing() {
    isEditing = false;
    text = note.text;
  }
  
  async function saveChanges() {
    if (!isOwner) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/${note.signature}/${note.textID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      isEditing = false;
      dispatch('updated');
      toastStore.showToast('Note updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating note:', error);
      toastStore.showToast('Failed to update note. Please try again.', 'error');
    }
  }
  
  async function deleteNote() {
    if (!isOwner) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/${note.signature}/${note.textID}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      dispatch('deleted');
      toastStore.showToast('Note deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting note:', error);
      toastStore.showToast('Failed to delete note. Please try again.', 'error');
    }
  }
  
  function copyToClipboard() {
    navigator.clipboard.writeText(note.text)
      .then(() => {
        toastStore.showToast('Copied to clipboard!', 'success');
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toastStore.showToast('Failed to copy to clipboard', 'error');
      });
  }
  
  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

<div 
  class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  on:click={handleOverlayClick}
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
>
  <div 
    class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
    in:scale={{ duration: 200, opacity: 0, start: 0.95, easing: quintOut }}
    out:scale={{ duration: 150, opacity: 0, start: 0.95, easing: quintOut }}
    on:click|stopPropagation
  >
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-lg font-medium text-gray-800">Note from @{note.signature}</span>
      </div>
      <button 
        class="text-gray-400 hover:text-gray-600 transition-colors"
        on:click={closeModal}
        aria-label="Close"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <div class="p-6 flex-grow overflow-y-auto">
      {#if isEditing}
        <div in:fly={{ y: 10, duration: 200 }}>
          <textarea 
            bind:value={text}
            bind:this={textareaElement}
            class="textarea h-64"
            placeholder="Enter your note..."
          ></textarea>
        </div>
      {:else}
        <div 
          class="whitespace-pre-line break-words text-gray-800"
          in:fly={{ y: 10, duration: 200 }}
        >
          {note.text}
        </div>
      {/if}
    </div>
    
    <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
      <div>
        {#if isOwner}
          {#if isEditing}
            <div class="flex space-x-2" in:fly={{ y: 10, duration: 200 }}>
              <button 
                class="btn btn-primary"
                on:click={saveChanges}
              >
                Save
              </button>
              <button 
                class="btn btn-secondary"
                on:click={cancelEditing}
              >
                Cancel
              </button>
            </div>
          {:else if confirmingDelete}
            <div class="flex space-x-2" in:fly={{ y: 10, duration: 200 }}>
              <button 
                class="btn btn-danger"
                on:click={deleteNote}
              >
                Confirm Delete
              </button>
              <button 
                class="btn btn-secondary"
                on:click={() => confirmingDelete = false}
              >
                Cancel
              </button>
            </div>
          {:else}
            <div class="flex space-x-2" in:fly={{ y: 10, duration: 200 }}>
              <button 
                class="btn btn-primary"
                on:click={startEditing}
              >
                Edit
              </button>
              <button 
                class="btn btn-danger"
                on:click={() => confirmingDelete = true}
              >
                Delete
              </button>
            </div>
          {/if}
        {/if}
      </div>
      
      <div>
        <button 
          class="btn btn-accent flex items-center"
          on:click={copyToClipboard}
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
          Copy to Clipboard
        </button>
      </div>
    </div>
  </div>
</div>