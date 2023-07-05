import React from 'react';
import { auth } from '../../firebaseOptions';
import { signOut } from 'firebase/auth';
import Logo from '../../images/favicon.png';

const Navbar: React.FC<any> = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to your desired page after successful logout
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen">
      <nav className="flex flex-col justify-between items-center p-4 bg-black min-w-200px text-white">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="h-8 w-8 mr-2" />
          <h1>Ref Buddy</h1>
        </div>
        <button onClick={handleLogout} className="border-white border bg-white text-black cursor-pointer py-1 px-2">
          Logout
        </button>
      </nav>
      <div className="flex-grow bg-white">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Navbar;
