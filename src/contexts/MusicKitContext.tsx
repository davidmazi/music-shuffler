import React, { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';

declare global {
  interface Window {
    MusicKit: any;
    MusicKitWebComponents: {
      initialize: (instance: any) => Promise<void>;
    };
  }
}

interface MusicKitInstance extends MusicKit.MusicKitInstance { }

interface MusicKitContextType {
  musicKit: MusicKitInstance | null;
  isAuthorized: boolean;
  userName: string | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  authorize: () => Promise<void>;
  unauthorize: () => Promise<void>;
  validateToken: () => Promise<boolean>;
  handleApiError: (error: any) => Promise<void>;
}

const MusicKitContext = createContext<MusicKitContextType | undefined>(undefined);

export const MusicKitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [musicKit, setMusicKit] = useState<MusicKitInstance | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Use ref to store the latest values to avoid stale closures
  const musicKitRef = useRef(musicKit);
  const isAuthorizedRef = useRef(isAuthorized);

  // Update refs when values change
  useEffect(() => {
    musicKitRef.current = musicKit;
    isAuthorizedRef.current = isAuthorized;
  }, [musicKit, isAuthorized]);

  // Function to handle authorization status changes
  const handleAuthChange = useCallback((event: any) => {
    setIsAuthorized(event.authorizationStatus === 3);
    console.debug("🚀\x1b[5m\x1b[32m ~ DM\x1b[0m\x1b[36m ~ MusicKitContext.tsx:113 ~ handleAuthChange ~ setIsAuthorized\x1b[0m", event.authorizationStatus)

    if (event.authorizationStatus === 3) {
      const instance = window.MusicKit.getInstance();
      setUserName(instance.user?.name || 'User');
    } else {
      setUserName(null);
    }
  }, []);

  // Function to validate token by making a test API call
  const validateToken = useCallback(async (): Promise<boolean> => {
    const currentMusicKit = musicKitRef.current;
    if (!currentMusicKit || !currentMusicKit.isAuthorized) {
      return false;
    }

    try {
      // Use a lighter endpoint that's less likely to cause 403 errors
      // Just check if we can access the API at all
      await currentMusicKit.api.music('/v1/catalog/us/songs', { limit: 1 });
      return true;
    } catch (error: any) {
      console.warn('Token validation failed:', error);
      // Only treat 401 as invalid token, 403 might be permission-related
      if (error.status === 401) {
        setIsAuthorized(false);
        setUserName(null);
        return false;
      }
      // For 403 and other errors, assume token is still valid but there might be permission issues
      return true;
    }
  }, []);

  // Function to handle API errors and trigger re-authorization if needed
  const handleApiError = useCallback(async (error: any): Promise<void> => {
    if (error.status === 401 || error.status === 403) {
      console.log('API error indicates invalid token, triggering re-authorization');
      setIsAuthorized(false);
      setUserName(null);
      setError('Your session has expired. Please sign in again.');

      // Optionally trigger automatic re-authorization
      const currentMusicKit = musicKitRef.current;
      if (currentMusicKit) {
        try {
          await currentMusicKit.authorize();
        } catch (authError) {
          console.error('Automatic re-authorization failed:', authError);
        }
      }
    }
  }, []);

  // Function to check and update authorization status
  const checkAuthorizationStatus = useCallback(async () => {
    const currentMusicKit = musicKitRef.current;
    if (currentMusicKit) {
      const currentAuthStatus = currentMusicKit.isAuthorized;

      // If MusicKit says we're authorized, update state
      if (currentAuthStatus && currentAuthStatus !== isAuthorizedRef.current) {
        setIsAuthorized(true);
        // Use window.MusicKit.getInstance() to get user info as it's more reliable
        const instance = window.MusicKit?.getInstance();
        setUserName(instance?.user?.name || 'User');
      } else if (!currentAuthStatus && isAuthorizedRef.current) {
        // MusicKit says we're not authorized
        setIsAuthorized(false);
        setUserName(null);
      }
      // Remove periodic token validation to avoid unnecessary API calls
    }
  }, []);

  useEffect(() => {
    const initializeMusicKit = async () => {
      try {
        setIsLoading(true);
        if (window.MusicKit) {
          const instance = await window.MusicKit.configure({
            developerToken: process.env.BUN_PUBLIC_DEVELOPER_TOKEN,
            app: {
              name: 'Music Shuffler',
              build: '1.0.0',
            },
          });
          setMusicKit(instance);

          if (instance.isAuthorized) {
            setIsAuthorized(true);
            setUserName(instance.user?.name || 'User');
          }

          instance.addEventListener('authorizationStatusDidChange', handleAuthChange);

          // Initialize MusicKit Web Components
          if (window.MusicKitWebComponents) {
            try {
              await window.MusicKitWebComponents.initialize(instance);
              console.log('MusicKit Web Components initialized successfully');
            } catch (webComponentError) {
              console.warn('Failed to initialize MusicKit Web Components:', webComponentError);
            }
          }

        } else {
          setError('MusicKit SDK not loaded.');
        }
      } catch (err) {
        setError(`Failed to initialize MusicKit: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    document.addEventListener('musickitloaded', initializeMusicKit);

    if (window.MusicKit) {
      initializeMusicKit();
    }

    return () => {
      document.removeEventListener('musickitloaded', initializeMusicKit);
      const instance = window.MusicKit?.getInstance();
      if (instance) {
        instance.removeEventListener('authorizationStatusDidChange', handleAuthChange);

      }
    };
  }, [handleAuthChange]);

  // Separate useEffect for the periodic check to avoid recreating the interval
  useEffect(() => {
    if (musicKit) {
      // Set up periodic authorization status check - less frequent to avoid API spam
      const authCheckInterval = setInterval(checkAuthorizationStatus, 10000); // Check every 10 seconds

      return () => {
        clearInterval(authCheckInterval);
      };
    }
  }, [musicKit, checkAuthorizationStatus]);

  const authorize = async () => {
    if (musicKit) {
      try {
        setIsAuthenticating(true);
        setError(null);
        await musicKit.authorize();
      } catch (err) {
        setError(`Authorization failed: ${(err as Error).message}`);
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      setError('MusicKit not initialized.');
    }
  };

  const unauthorize = async () => {
    if (musicKit) {
      try {
        setIsAuthenticating(true);
        setError(null);
        await musicKit.unauthorize();
      } catch (err) {
        setError(`Unauthorization failed: ${(err as Error).message}`);
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  const value = {
    musicKit,
    isAuthorized,
    userName,
    error,
    isLoading,
    isAuthenticating,
    authorize,
    unauthorize,
    validateToken,
    handleApiError
  };

  return (
    <MusicKitContext.Provider value={value}>
      {children}
    </MusicKitContext.Provider>
  );
};

export const useMusicKit = () => {
  const context = useContext(MusicKitContext);
  if (context === undefined) {
    throw new Error('useMusicKit must be used within a MusicKitProvider');
  }
  return context;
};
