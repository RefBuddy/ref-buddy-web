import React from 'react';
import { useAppSelector } from '../../store';
import { signOut } from 'firebase/auth';
import { Link } from 'gatsby';
import { auth } from '../../firebaseOptions';
import Logo from '../../images/favicon.png';

const Navbar: React.FC<any> = () => {
  const uid = auth.currentUser?.uid;
  const user = useAppSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to your desired page after successful logout
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen sticky top-0">
      <nav className="flex flex-col justify-start items-center p-4 bg-black min-w-200px text-white">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="h-16 w-16 mr-2" />
        </div>
        <div className="flex flex-col text-lg mt-8 gap-2">
          <Link
            id="nav-link"
            className="text-white hover:text-orange-500 link-focus"
            to={`/portal/${uid}/dashboard`}
          >
            Dashboard
          </Link>
          <Link
            id="nav-link"
            className="text-white hover:text-orange-500 link-focus"
            to={`/portal/${uid}/admin`}
          >
            Admin
          </Link>
          {user.currentLeague === 'bchl' && (
            <Link
              id="nav-link"
              className="text-white hover:text-orange-500 link-focus"
              to={`/portal/${uid}/stats`}
            >
              Stats
            </Link>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="border-white border bg-white text-black cursor-pointer px-1 mt-auto"
        >
          Logout
        </button>
      </nav>
      {/* <div className="flex-grow bg-white">Add your content here</div> */}
    </div>
  );
};

export default Navbar;
