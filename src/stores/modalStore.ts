import { writable } from 'svelte/store';

type ModalState = {
  isOpen: boolean;
  noteId: string | null;
};

function createModalStore() {
  const initialState: ModalState = {
    isOpen: false,
    noteId: null,
  };
  
  const { subscribe, set, update } = writable<ModalState>(initialState);
  
  return {
    subscribe,
    openModal: (noteId: string) => {
      update(() => ({
        isOpen: true,
        noteId,
      }));
    },
    closeModal: () => {
      update((state) => ({
        ...state,
        isOpen: false,
      }));
    },
  };
}

export const modalStore = createModalStore();