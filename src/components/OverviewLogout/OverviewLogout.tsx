import React from 'react';
import { auth } from '../../firebaseOptions';
import { signOut } from 'firebase/auth';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

const OverviewLogout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to your desired page after successful logout
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56 cursor-pointer"
      onClick={handleLogout}
    >
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-start items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase mt-10">
            Logout
          </h6>
        </div>
        <div className="flex justify-end items-end w-full mt-12">
          <ArrowLeftOnRectangleIcon className="w-12 h-12 text-black" />
        </div>
      </div>
    </div>
  );
};

export default OverviewLogout;
