import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Typography } from '@mui/material';

const AssigningStatus = () => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div 
      onClick={handleClick} 
      className="flex flex-col justify-between border-gray-200 border-solid border rounded-lg shadow-sm px-4 py-2 mx-4 cursor-pointer" 
      style={{ height: '180px', width: '215px' }}
    >
      <div className="flex justify-between items-center">
        <Typography
          color="textSecondary"
          variant="overline"
          className='pt-3'
        >
          Assigning Status
        </Typography>
      </div>
      <div className="flex justify-between items-center">
        <Typography variant="h6">
          {isActive ? 'Active' : 'Disabled'}
        </Typography>
        {isActive 
            ? <CheckCircleIcon style={{width: "60px", height: "60px", color: "green"}} />
            : <XCircleIcon style={{width: "60px", height: "60px", color: "red"}} />
            }
      </div>
    </div>
  );
};

export default AssigningStatus;
