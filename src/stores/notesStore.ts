import { writable } from 'svelte/store';
import type { Note } from '../types';

function createNotesStore() {
  const { subscribe, set, update } = writable<Note[]>([]);
  
  return {
    subscribe,
    setNotes: (notes: Note[]) => {
      set(notes);
    },
    addNote: (note: Note) => {
      update((notes) => [note, ...notes]);
    },
    updateNote: (updatedNote: Note) => {
      update((notes) => 
        notes.map((note) => 
          note.textID === updatedNote.textID ? updatedNote : note
        )
      );
    },
    deleteNote: (textID: string) => {
      update((notes) => notes.filter((note) => note.textID !== textID));
    },
  };
}

export const notesStore = createNotesStore();