import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebaseOptions';
import { signInWithEmailAndPassword, getIdTokenResult } from 'firebase/auth';
import Logo from '../../images/favicon.png';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { navigate } from 'gatsby';
import { useAuthenticationStatus } from '../../components/hooks';
import { toast } from 'react-toastify';
import { setCurrentLeague } from '../../store/User/reducer';
import { getUserLeagues } from '../../store/User/actions';

const Login: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, loading] = useAuthenticationStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useAppSelector((state) => state.user);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading && justLoggedIn && user.currentLeague) {
      dispatch(setCurrentLeague(user.currentLeague));
      const uid = auth.currentUser?.uid;
      if (uid) {
        navigate(`/portal/${uid}/dashboard`);
      }
      // Reset justLoggedIn to false after handling
      setJustLoggedIn(false);
    }
  }, [isAuthenticated, loading, justLoggedIn, user, dispatch]);

  const getLeague = async (uid) => {
    await dispatch(getUserLeagues(uid));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const tokenResult = await getIdTokenResult(user);
        const claims = tokenResult.claims;

        if (claims['role'] === 'admin') {
          const uid = user.uid;
          await getLeague(uid);
          setJustLoggedIn(true);
        } else {
          toast.error('Not an admin user');
        }
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const response = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await getIdTokenResult(response.user);
      const claims = tokenResult.claims;

      if (claims['role'] === 'admin') {
        const uid = response.user.uid;
        // get user doc
        await getLeague(uid);
        setJustLoggedIn(true);
      } else {
        toast.error('Not an admin user');
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
      <Button className="mt-4 w-full" onClick={() => handleLogin()}>
        Login
      </Button>
    </div>
  );
};

export default Login;
