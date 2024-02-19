import React from 'react';

const AlreadyAssignedGameTodayCard = ({ homeTeamAbbreviation }) => (
  <div className="flex items-center">
    <p className={'text-sm font-normal text-error-500'}>
      <strong>@ {homeTeamAbbreviation}</strong>
    </p>
  </div>
);

export default AlreadyAssignedGameTodayCard;
