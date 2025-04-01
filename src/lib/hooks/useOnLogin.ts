import { useEffect } from 'react';
import { getIdToken, getLocalStorage, LocalStorageKey } from '../utils/local-storage';
import { useAgentStore } from '../store/useAgentStore';
import { toast } from 'react-hot-toast';

/**
 * Hook to handle initialization tasks when a user logs in
 */
export function useOnLogin() {
  const initializeAgent = useAgentStore(state => state.initializeAgent);

  useEffect(() => {
      const token = getIdToken();
      const isLoggedIn = getLocalStorage(LocalStorageKey.LoggedIn) === 'true';
      console.log('isLoggedIn', isLoggedIn);
      
      // Only initialize if the user is logged in and has a token
      if (token && isLoggedIn) {
        const initialize = async () => {
          try {
            console.log('User logged in, initializing agent...');
            await initializeAgent();
            
            console.log('Agent initialization complete');
          } catch (err) {
            console.error('Failed to initialize agent:', err);
            toast.error('Failed to initialize agent. Please refresh and try again.');
          } finally {
          }
        };

        initialize();
      }
  }, [initializeAgent]);
}
