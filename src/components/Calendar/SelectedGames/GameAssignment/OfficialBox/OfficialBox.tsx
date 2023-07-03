import React, { useEffect, useState } from 'react';
import OfficialsList from '../../../../OfficialsList/OfficialsList';

const UserProfile = ({ userData }) => {
  const name = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        className="rounded-full max-w-[100px] max-h-[100px] object-cover h-[100px] w-[100px]"
        src={userData.profilePictureUrl}
        alt={name}
      />
      <p className={`text-center pt-6`}>{name}</p>
    </div>
  );
};

const OfficialBox = ({ gameData, official, role, label, color }) => {
  const [showOfficialsList, setShowOfficialsList] = useState(false);

  useEffect(() => {
    const closeDropdown = () => setShowOfficialsList(false);
    if (typeof window !== 'undefined') {
      window.addEventListener('click', closeDropdown);
    }

    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const handleClick = () => {
    if (!official) {
      setShowOfficialsList(true); 
    } else {
      // ... handle click on box when official is present
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center border-2 rounded-md p-3 mx-1 cursor-pointer relative flex-none w-40 h-48 shadow-md ${color === 'orange' ? 'border-orange-500' : color === 'black' ? 'border-black' : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      {official ?
        <UserProfile userData={official}/> :
        <div>Add {label}</div>}

      {showOfficialsList && <OfficialsList game={gameData} role={role} />}
    </div>
  );  
};

export default OfficialBox;