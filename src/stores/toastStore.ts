import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastState = {
  visible: boolean;
  message: string;
  type: ToastType;
  timeout?: number;
};

function createToastStore() {
  const initialState: ToastState = {
    visible: false,
    message: '',
    type: 'info',
    timeout: undefined,
  };
  
  const { subscribe, set, update } = writable<ToastState>(initialState);
  
  function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
    update((state) => {
      // Clear any existing timeout
      if (state.timeout) {
        clearTimeout(state.timeout);
      }
      
      // Create new timeout
      const timeout = window.setTimeout(() => {
        update((s) => ({ ...s, visible: false }));
      }, duration);
      
      return {
        visible: true,
        message,
        type,
        timeout,
      };
    });
  }
  
  function hideToast() {
    update((state) => {
      if (state.timeout) {
        clearTimeout(state.timeout);
      }
      
      return {
        ...state,
        visible: false,
        timeout: undefined,
      };
    });
  }
  
  return {
    subscribe,
    showToast,
    hideToast,
  };
}

export const toastStore = createToastStore();