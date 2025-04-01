import { useEffect } from 'react';
import { getIdToken, getLocalStorage, LocalStorageKey } from '../utils/local-storage';
import { toast } from 'react-hot-toast';
import { useReplayStore } from '../store/useReplayStore';

/**
 * Hook to handle initialization tasks when a user logs in
 */
export function useLoadReplay() {
  const initializeReplay = useReplayStore(state => state.initializeReplay);

  useEffect(() => {
      const token = getIdToken();
      const isLoggedIn = getLocalStorage(LocalStorageKey.LoggedIn) === 'true';
      console.log('isLoggedIn', isLoggedIn);
      
      // Only initialize if the user is logged in and has a token
      if (token && isLoggedIn) {
        const initialize = async () => {
          try {
            console.log('User logged in, initializing replay...');
            await initializeReplay();
            
            console.log('Replay initialization complete');
          } catch (err) {
            console.error('Failed to initialize replay:', err);
            toast.error('Failed to initialize replay. Please refresh and try again.');
          }
        };

        initialize();
      }
  }, [initializeReplay]);
}
