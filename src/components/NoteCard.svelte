<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { modalStore } from '../stores/modalStore';
  import type { Note } from '../types';
  
  export let note: Note;
  
  const dispatch = createEventDispatcher();
  const maxPreviewLength = 100;
  
  $: previewText = note.text.length > maxPreviewLength 
    ? `${note.text.substring(0, maxPreviewLength)}...` 
    : note.text;
    
  $: formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  function handleClick() {
    modalStore.openModal(note.textID);
    updateUrl();
  }
  
  function updateUrl() {
    const url = `/${note.signature}/${note.textID}`;
    window.history.pushState({ noteId: note.textID }, '', url);
  }
</script>

<div 
  class="card cursor-pointer p-4 h-full flex flex-col"
  on:click={handleClick}
  in:fly={{ y: 20, duration: 300, delay: 100 }}
  out:fade={{ duration: 200 }}
>
  <div class="flex-grow">
    <p class="text-gray-800 whitespace-pre-line break-words mb-3">{previewText}</p>
  </div>
  
  <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
    <div class="font-medium">@{note.signature}</div>
    <div>{formattedDate}</div>
  </div>
</div>