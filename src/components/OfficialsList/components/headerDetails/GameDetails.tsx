import React from 'react';
import * as Utils from '../../utils';

const GameDetails = ({ game, currentLeague }) => (
    <div className="flex w-full items-center justify-start p-4">
        <div className="flex flex-row items-center gap-2 ml-6">
            {currentLeague == 'bchl' ? (
                <>
                    <div className="flex flex-col items-center justify-center">
                        <img
                            width={40}
                            height={40}
                            src={game.visitingTeam.logo}
                            alt="visiting team logo"
                        />
                        <p className="text-sm text-black text-center min-w-24">
                            {game.visitingTeam.city}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg font-bold -mt-3">@</div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <img
                            width={40}
                            height={40}
                            src={game.homeTeam.logo}
                            alt="home team logo"
                        />
                        <p className="text-sm text-black text-center min-w-24">
                            {game.homeTeam.city}
                        </p>
                    </div>
                </>
            ) : (
                <div className="w-full h-6 bg-white"></div>
            )}
            <div className="flex flex-col -mb-2">
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1 w-40">
                    {Utils.getFormattedTime(game.time)}
                </div>
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1">
                    {game.date.slice(0, -6)}
                </div>
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1">
                    {game.venue}
                </div>
            </div>
        </div>
    </div>
);

export default GameDetails;