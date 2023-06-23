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
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'black', width: '300px' }}>
        <h1 style={{ color: 'white' }}>Ref Buddy</h1>
        <button onClick={handleLogout} style={{ border: '1px solid white', backgroundColor: 'white', color: 'black', cursor: 'pointer', padding: '3px 6px' }}>
          Logout
        </button>
      </nav>
      <div style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Navbar;