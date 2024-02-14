import React from 'react';

const RoleCard = ({ roleDetails, label }) => (
    <div
        className={`flex flex-col items-center justify-center border-2 rounded-md p-1 -mt-2 cursor-pointer relative min-h-12 flex-none w-36 shadow-md ${
            roleDetails === 'Referee'
                ? 'border-orange-500'
                : roleDetails === 'Linesman'
                ? 'border-black'
                : ''
        }`}
    >
        <div>{label}</div>
    </div>
);

export default RoleCard;