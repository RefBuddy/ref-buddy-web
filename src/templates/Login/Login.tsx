import React, { useState } from 'react';
import { auth } from '../../firebaseOptions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Logo from '../../images/favicon.png';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';

const Login: React.FC<any> = ({ data }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(data);
  const handleLogin = async () => {

    try {
      await signInWithEmailAndPassword(auth, email, password); // Change this line
      // Redirect to your desired page after successful login
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
        setValue={setEmail}
      />
      <TextInput
        className="mt-4 w-full"
        label="Password"
        placeholder="Password"
        value={password}
        setValue={setPassword}
        type="password"
      />
      <Button
        className="mt-4 w-full"
        onClick={handleLogin}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
