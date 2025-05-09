<script lang="ts">
  import { fade } from 'svelte/transition';
  import NoteCard from './NoteCard.svelte';
  import type { Note } from '../types';
  
  export let notes: Note[] = [];
</script>

<div 
  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  in:fade={{ duration: 300 }}
>
  {#each notes as note (note.textID)}
    <div class="h-full">
      <NoteCard {note} />
    </div>
  {/each}
</div>