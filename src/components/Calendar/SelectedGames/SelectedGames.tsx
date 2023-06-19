import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSelectedGames } from '../../../store/Games/reducer';

const SelectedGames = () => {
  const dispatch = useAppDispatch();
  const selectedGames = useAppSelector(state => state.games.selectedGames)
  const clear = () => {
    dispatch(setSelectedGames([]));
  }
  console.log(selectedGames)
  return (
    <div>
      <div className="flex flex-row justify-between items-center p-5">
        <h1>Selected Games</h1>
        <button onClick={() => clear()}>Clear</button>
      </div>
      <div className="flex flex-row items-center gap-4 flex-wrap max-w-2/3">
        {selectedGames.map(game => (
          <div key={game.id} className="w-full flex flex-col items-start justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm p-5 mx-4 cursor-pointer">
            <div className={`flex flex-row items-center gap-3`}>
              <div className="flex flex-col items-center justify-center">
                <img width={70} height={70} src={game.visitingTeam.logo} alt="visiting team logo" />
                <p className="text-sm opacity-70 pt-2">{game.visitingTeam.city}</p>
                <p className="text-gray-700 text-sm opacity-50">Visiting</p>
              </div>
              <div style={{ minWidth: '30px' }}></div>
              <div className="flex flex-col items-center justify-center">
                <img width={70} height={70} src={game.homeTeam.logo} alt="home team logo" />
                <p className="text-sm opacity-70 pt-2">{game.homeTeam.city}</p>
                <p className="text-gray-700 text-sm opacity-50">Home</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectedGames;
