import React from 'react';

const AssignedGamesCard = ({ assignedGames }) => (
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
                        <>
                            {assignedGames[dateKey].map((game) => (
                                <tr
                                    key={`games-${dateKey}`}
                                    className="text-xs font-body text-gray-700"
                                >
                                    <td>{dateKey}</td>
                                    <td>
                                        {game.visiting_team.abbreviation} @{' '}
                                        {game.home_team.abbreviation}
                                    </td>
                                </tr>
                            ))}
                        </>
                    ))}
            </tbody>
        </table>
    </div>
);

export default AssignedGamesCard;