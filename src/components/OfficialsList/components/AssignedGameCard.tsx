import React from 'react';

const AssignedGameCard = ({ assignedGamesAlready }) => (
    <div className="flex items-center">
        <p
        className={`text-sm font-normal ${
            assignedGamesAlready.length > 0
            ? 'text-error-500'
            : 'text-gray-900'
        }`}
        >
        <strong>
            @ {assignedGamesAlready[0].home_team.abbreviation}
        </strong>
        </p>
    </div>
);

export default AssignedGameCard;