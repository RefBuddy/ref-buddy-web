import React from 'react';
import { auth } from '../../firebaseOptions';
import { signOut } from 'firebase/auth';

const Navbar: React.FC<any> = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully');
      // Redirect to your desired page after successful logout
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'black' }}>
      <h1 style={{ color: 'white' }}>Ref Buddy</h1>
      <button onClick={handleLogout} style={{ border: '1px solid white', backgroundColor: 'white', color: 'black', cursor: 'pointer', marginLeft: 'auto', padding: '3px 6px' }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;