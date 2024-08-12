import React from 'react';

const AssignedGamesCard = ({ assignedGames }) => {
  const filterDate = new Date('2024-08-01T00:00:00Z');

  // Filter function to check if the game date is after August 1, 2024
  const isGameAfterAugust2024 = (dateKey, game) => {
    const gameDate = new Date(game.date_ISO8601);
    return gameDate > filterDate;
  };

  return (
    <div className="h-auto w-52">
      <p className="text-xs mt-4 font-bold">Assigned Games</p>
      <table className="mt-2 max-h-[300px] h-auto overflow-y-auto w-44">
        <thead>
          <tr className="text-xs font-medium text-black">
            <td>Date</td>
            <td>Game</td>
          </tr>
        </thead>
        <tbody>
          {assignedGames &&
            Object.keys(assignedGames).map((dateKey) => (
              <React.Fragment key={`date-${dateKey}`}>
                {assignedGames[dateKey]
                  .filter((game) => isGameAfterAugust2024(dateKey, game))
                  .map((game) => (
                    <tr
                      key={`game-${game.id || dateKey}`}
                      className="text-xs font-body text-gray-700"
                    >
                      <td>{dateKey}</td>
                      <td>
                        {game.visiting_team.abbreviation} @{' '}
                        {game.home_team.abbreviation}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedGamesCard;
