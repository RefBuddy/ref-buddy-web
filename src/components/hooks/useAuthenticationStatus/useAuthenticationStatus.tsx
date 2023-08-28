/* eslint-disable max-depth */
import { useState, useEffect } from 'react';
import { auth } from '../../../firebaseOptions';

export default function useAuthenticationStatus(): [boolean, boolean] {
  // Set default to true until we can check if they are authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        // check if user is authenticated

        if (auth) {
          auth.onAuthStateChanged((user) => {
            if (user) {
              setIsAuthenticated(true);
              setLoading(false);
            } else {
              setIsAuthenticated(false);
              setLoading(false);
            }
          });
        }
        if (auth && auth.currentUser) {
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      } catch (error) {
        // if at any point this fails then we are not authenticated
        setIsAuthenticated(false);
        setLoading(false);
      }
    })();
  }, []);

  return [isAuthenticated, loading];
}
