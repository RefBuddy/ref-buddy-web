import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseOptions';
import { signInWithEmailAndPassword, getIdTokenResult } from 'firebase/auth';
import Logo from '../../images/favicon.png';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { navigate } from 'gatsby';
import { useAuthenticationStatus } from '../../components/hooks';
import { toast } from 'react-toastify';

const Login: React.FC<any> = () => {
  const [isAuthenticated, loading] = useAuthenticationStatus();
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated && !loading && isAdmin) {
      const id = auth.currentUser?.uid;
      if (id) {
        navigate(`/portal/${id}/dashboard`);
      }
    }
  }, [isAuthenticated, loading, isAdmin])

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await getIdTokenResult(response.user);
      const claims = tokenResult.claims;

      if (claims['role'] === 'admin') {
        const id = response.user.uid;
        setIsAdmin(true);
        // get user doc
        navigate(`/portal/${id}/dashboard`);
      } else {
        toast.error("Not an admin user");
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
