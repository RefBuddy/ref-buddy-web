import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useAuthenticationStatus } from '../hooks';

interface PrivateRouteProps {
  component: React.ElementType;
  path: string;
  id?: string;
  props?: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const [isAuthenticated, loading] = useAuthenticationStatus();
  useEffect(() => {
    if (loading) {
      return;
    }
    // If user not authenticated redirect to auth gateway
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        navigate('/');
      }
    }
  }, [isAuthenticated, loading]);

  const { component: Component, ...rest } = props;

  return <Component {...rest} />;
};

export default PrivateRoute;
