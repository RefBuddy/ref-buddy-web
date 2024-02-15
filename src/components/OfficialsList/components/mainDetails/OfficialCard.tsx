import React from 'react';

const OfficialCard = ({ official }) => (
    <div className="flex items-center gap-2">
        <img
        className="w-10 h-10 rounded-full"
        src={official.profilePictureUrl}
        alt="official"
        />
        <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-600">
            {official.firstName} {official.lastName}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
            {official.city}
        </p>
        </div>
    </div>
);

export default OfficialCard;