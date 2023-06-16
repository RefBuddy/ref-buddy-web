/* eslint-disable max-depth */
import { useState, useEffect } from 'react';

export default function useAuthenticationStatus(): [boolean, boolean] {
  // Set default to true until we can check if they are authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        // check authentication status if they are logged in setIsAuthenticated(true) and setLoading(false)
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
