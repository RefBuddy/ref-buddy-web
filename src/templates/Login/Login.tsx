import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseOptions';
import { signInWithEmailAndPassword, getIdTokenResult } from 'firebase/auth';
import Logo from '../../images/favicon.png';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { navigate } from 'gatsby';
import { useAuthenticationStatus } from '../../components/hooks';

const Login: React.FC<any> = () => {
  const [isAuthenticated, loading] = useAuthenticationStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const id = auth.currentUser?.uid;
      if (id) {
        navigate(`/portal/${id}/dashboard`);
      }
    }
  }, [isAuthenticated, loading])

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await getIdTokenResult(response.user);
      const claims = tokenResult.claims;

      if (claims['role'] === 'admin') {
        const id = response.user.uid;
        navigate(`/portal/${id}/dashboard`);
      } else {
        console.error("Not an admin user");
        // Here, you might want to show an error or redirect them elsewhere
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-md flex flex-col mt-8 items-center justify-center">
      <img src={Logo} alt="Logo" className="w-48 h-48" />
      <h1 className="mt-8">Login</h1>
      <TextInput
        className="mt-4 w-full"
        label="Email"
        placeholder="Email"
        value={email}
        setValue={(value) => setEmail(value)}
      />
      <TextInput
        className="mt-4 w-full"
        label="Password"
        placeholder="Password"
        value={password}
        setValue={(value) => setPassword(value)}
        type="password"
      />
      <Button
        className="mt-4 w-full"
        onClick={() => handleLogin()}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
