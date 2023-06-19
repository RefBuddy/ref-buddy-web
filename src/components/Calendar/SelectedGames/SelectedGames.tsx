import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSelectedGames } from '../../../store/Games/reducer';

const SelectedGames = () => {
  const dispatch = useAppDispatch();
  const selectedGames = useAppSelector(state => state.games.selectedGames)
  const clear = () => {
    dispatch(setSelectedGames([]));
  }
  return (
    <div>
      <div className="flex flex-row justify-between items-center p-5">
        <h1>Selected Games</h1>
        <button onClick={() => clear()}>Clear</button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 flex-wrap max-w-2/3">
        {selectedGames.map(game => (
          <div key={game.id} className="flex flex-col items-center justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm p-5 cursor-pointer">
            <div className={`flex flex-row items-center justify-center gap-3`}>
              <img width={50} height={50} src={game.homeTeam.logo} alt="home team logo" />
              <p>vs</p>
              <img width={50} height={50} src={game.visitingTeam.logo} alt="visiting team logo" />
            </div>
            <p>{game.homeTeam.abbreviation} vs. {game.visitingTeam.abbreviation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectedGames;