<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import NoteGrid from './components/NoteGrid.svelte';
  import NoteModal from './components/NoteModal.svelte';
  import Header from './components/Header.svelte';
  import SignatureInput from './components/SignatureInput.svelte';
  import { notesStore } from './stores/notesStore';
  import { userStore } from './stores/userStore';
  import { modalStore } from './stores/modalStore';
  import { toastStore } from './stores/toastStore';
  import Toast from './components/Toast.svelte';
  import type { Note } from './types';
  import { Store, Instagram, Linkedin, Github } from 'lucide-svelte';

  let notes: Note[] = [];
  let isLoading = true;
  let showCreateNote = false;
  
  $: activeNote = $modalStore.isOpen ? $notesStore.find(note => note.textID === $modalStore.noteId) : null;

  onMount(async () => {
    await loadNotes();

    // Update URL based on initial route
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 2) {
      const [signature, textID] = pathParts;
      const note = $notesStore.find(note => note.textID === textID);
      
      if (note) {
        modalStore.openModal(textID);
        userStore.setSignature(signature);
      }
    }

    // Handle browser navigation
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  });

  function handlePopState() {
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    if (pathParts.length === 2) {
      const [signature, textID] = pathParts;
      const note = $notesStore.find(note => note.textID === textID);
      
      if (note) {
        modalStore.openModal(textID);
        userStore.setSignature(signature);
      }
    } else {
      modalStore.closeModal();
    }
  }

  async function loadNotes() {
    isLoading = true;
    try {
      const response = await fetch('http://localhost:3000/api/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      notesStore.setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
      toastStore.showToast('Failed to load notes. Please try again.', 'error');
    } finally {
      isLoading = false;
    }
  }

  function handleNoteCreated() {
    loadNotes();
    showCreateNote = false;
  }

  function handleNoteDeleted() {
    loadNotes();
    modalStore.closeModal();
  }

  function handleNoteUpdated() {
    loadNotes();
  }

  $: {
    notes = $notesStore;
  }
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <Header />
  
  <main class="flex-grow container mx-auto px-4 py-6 relative">
    {#if isLoading}
      <div class="flex justify-center items-center py-12" in:fade={{ duration: 300 }}>
        <div class="animate-pulse flex flex-col items-center">
          <div class="w-12 h-12 rounded-full bg-primary-300 mb-4"></div>
          <div class="text-primary-700">Loading notes...</div>
        </div>
      </div>
    {:else if notes.length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center" in:fly={{ y: 20, duration: 300 }}>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No notes yet</h2>
        <p class="text-gray-500 mb-6">Add your first note to get started!</p>
      </div>
    {:else}
      <NoteGrid {notes} />
    {/if}

    <!-- Floating Action Button -->
    <button
      class="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 flex items-center justify-center transition-transform hover:scale-110"
      on:click={() => showCreateNote = true}
    >
      <span class="text-2xl">+</span>
    </button>
  </main>

  <footer class="bg-transparent text-blue-900 py-6">
    <br /><br />
    <div class="container mx-auto px-4">
      <hr class="border-blue-300 mb-4" />
      <div class="text-center">
        <a
          href="https://aaroophan.onrender.com"
          class="inline-flex items-center gap-2 text-blue-900 hover:text-blue-50 transition-colors duration-200"
        >
          &copy; 2025
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocKNRvtI3cvci9DHfzBfC3d0PgPneG86fZv7w5se1U5mfBgcNqXj4g=s83-c-mo"
            alt="Aaroophan"
            class="h-5 w-5 rounded-full"
          />
          Aaroophan
        </a>

        <ul class="flex justify-center gap-4 mt-4">
          <li>
            <a
              href="http://aaroophan.onrender.com"
              aria-label="Portfolio"
              class="hover:text-blue-50 transition-colors duration-200"
            >
              <Store size={15} />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/aaroophan/?theme=dark"
              aria-label="Instagram"
              class="hover:text-blue-50 transition-colors duration-200"
            >
              <Instagram size={15} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/aaroophan"
              aria-label="LinkedIn"
              class="hover:text-blue-50 transition-colors duration-200"
            >
              <Linkedin size={15} />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Aaroophan"
              aria-label="GitHub"
              class="hover:text-blue-50 transition-colors duration-200"
            >
              <Github size={15} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>

  {#if showCreateNote}
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      on:click|self={() => showCreateNote = false}
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
    >
      <div class="w-full max-w-lg">
        <SignatureInput 
          on:noteCreated={handleNoteCreated}
          on:close={() => showCreateNote = false}
        />
      </div>
    </div>
  {/if}
  
  {#if $modalStore.isOpen && activeNote}
    <NoteModal 
      note={activeNote} 
      on:close={() => modalStore.closeModal()}
      on:deleted={handleNoteDeleted}
      on:updated={handleNoteUpdated}
    />
  {/if}
  
  {#if $toastStore.visible}
    <Toast />
  {/if}
</div>