import React from 'react';
import { signOut } from 'firebase/auth';
import { Link } from 'gatsby';
import { auth } from '../../firebaseOptions';
import Logo from '../../images/favicon.png';

const Navbar: React.FC<any> = () => {
  const uid = auth.currentUser?.uid;
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to your desired page after successful logout
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen sticky top-0 h-screen">
      <nav className="flex flex-col justify-between items-center p-4 bg-black min-w-200px text-white">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="h-12 w-12 mr-2" />
        </div>
        <div className="flex flex-col text-sm">
          <Link to={`/portal/${uid}/dashboard`}>Dashboard</Link>
          <Link to={`/portal/${uid}/stats`}>Stats</Link>
        </div>
        <button
          onClick={handleLogout}
          className="border-white border bg-white text-black cursor-pointer px-1"
        >
          Logout
        </button>
      </nav>
      <div className="flex-grow bg-white">{/* Add your content here */}</div>
    </div>
  );
};

export default Navbar;
