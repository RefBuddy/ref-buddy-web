import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useAppDispatch } from '../../store';
import { setAssigningStatus } from '../../store/Assigning/reducer';

const AssigningStatus = () => {
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    dispatch(setAssigningStatus(!isActive));
  };

  return (
    <div 
      onClick={handleClick} 
      className="flex flex-col justify-between border border-gray-200 rounded-lg shadow-sm px-4 py-2 mx-4 cursor-pointer h-48 w-56" 
    >
      <div className="flex justify-between items-center">
        <h6 className="text-gray-700 text-sm font-medium pt-2 uppercase">
          Assigning Status
        </h6>
      </div>
      <div className="flex justify-between items-center">
        <h6 className="text-lg font-semibold">
          {isActive ? 'Active' : 'Disabled'}
        </h6>
        {isActive 
            ? <CheckCircleIcon className="w-16 h-16 text-green-500" fill="currentColor" />
            : <XCircleIcon className="w-16 h-16 text-red-500" fill="currentColor" />
        }
      </div>
    </div>
  );
};

export default AssigningStatus;
