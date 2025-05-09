import { writable } from 'svelte/store';

type UserState = {
  signature: string;
};

function createUserStore() {
  // Try to get saved signature from localStorage
  const savedSignature = typeof localStorage !== 'undefined' 
    ? localStorage.getItem('userSignature') 
    : '';
  
  const initialState: UserState = {
    signature: savedSignature || '',
  };
  
  const { subscribe, set, update } = writable<UserState>(initialState);
  
  return {
    subscribe,
    setSignature: (signature: string) => {
      // Save to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('userSignature', signature);
      }
      
      update((state) => ({
        ...state,
        signature,
      }));
    },
  };
}

export const userStore = createUserStore();