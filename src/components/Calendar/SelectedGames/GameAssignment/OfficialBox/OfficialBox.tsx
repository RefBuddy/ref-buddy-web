import React, { useEffect, useState } from 'react';
import OfficialsList from '../../../../OfficialsList/OfficialsList';

const UserProfile = ({ userData, handleClick }) => {
  const name = `${userData.firstName} ${userData.lastName}`;

  return (
    <div 
      className="flex items-center"
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      <img 
        className="rounded-full max-w-[50px] max-h-[50px] object-cover h-[50px] w-[50px]"
        src={userData.profilePictureUrl}
        alt={name}
      />
      <div className="flex flex-col ml-4">
        <p className="text-left">{userData.firstName}</p>
        <p className="text-left">{userData.lastName}</p>
      </div>
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
      className={`flex flex-col items-center justify-center border-2 rounded-md p-3 mx-1 cursor-pointer relative flex-none w-36 shadow-md ${color === 'orange' ? 'border-orange-500' : color === 'black' ? 'border-black' : ''}`}
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
    >
      {official ?
        <UserProfile userData={official} handleClick={handleClick}/> :
        <div>Add {label}</div>}

      {showOfficialsList && <OfficialsList setShowOfficialsList={setShowOfficialsList} game={gameData} role={role} />}
    </div>
  );  
};

export default OfficialBox;