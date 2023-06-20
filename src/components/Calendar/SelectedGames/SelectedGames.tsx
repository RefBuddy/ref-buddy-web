import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSelectedGames } from '../../../store/Games/reducer';
import { fetchOfficialsProfiles } from '../../../store/Games/actions';

const UserProfile = ({ userData, color }) => {
  const name = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        className="rounded-full max-w-[100px] max-h-[100px] object-cover h-[100px] w-[100px]"
        width={100}
        height={100}
        src={userData.profilePictureUrl}
        alt={name}
      />
      <p className={`text-center ${color === 'orange' ? 'text-black' : 'text-white' }`}>{name}</p>
    </div>
  );
};

const OfficialBox = ({ official, label, color, officialsData }) => {
  const handleClick = () => {
    // ... handle click on box
  };

  return (
    <div 
      className="flex flex-col items-center justify-center border p-2 mx-1 cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      {official ?
        <UserProfile userData={official} color={color} /> :
        <div>Add {label}</div>}
    </div>
  );
};

const GameAssignment = ({ game, officialsData }) => {

  return (
    <div className="flex">
      <OfficialBox official={officialsData.official1} label="Referee 1" color="orange" officialsData={officialsData} />
      <OfficialBox official={officialsData.official2} label="Referee 2" color="orange" officialsData={officialsData} />
      <OfficialBox official={officialsData.official3} label="Linesman 1" color="black" officialsData={officialsData} />
      <OfficialBox official={officialsData.official4} label="Linesman 2" color="black" officialsData={officialsData} />
    </div>
  );
};

const SelectedGames = () => {
  const dispatch = useAppDispatch();
  const selectedGames = useAppSelector(state => state.games.selectedGames)

  const clear = () => {
    dispatch(setSelectedGames([]));
  }

  useEffect(() => {
    // Dispatch action to fetch officials data
    selectedGames.forEach(game => {
      const gameId = game.id
      let officials = game.officials;
      dispatch(fetchOfficialsProfiles({ officials, gameId }));
    })

  }, [selectedGames]);
  
  console.log(selectedGames)
  const officialsData = useAppSelector(state => state.games.officialsData);

  console.log("officialsData", officialsData);
  
  return (
    <div>
      <div className="flex flex-row justify-between items-center p-5">
        <h1>Selected Games</h1>
        <button onClick={() => clear()}>Clear</button>
      </div>
      <div className="flex flex-row items-center gap-4 flex-wrap max-w-2/3">
      {selectedGames.map(game => (
          <div key={game.id} className="w-full flex flex-col items-start justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm p-5 mx-4 cursor-pointer">
            <div className={`flex flex-row items-start justify-between gap-3 w-full`}>
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.visitingTeam.logo} alt="visiting team logo" />
                  <p className="text-sm opacity-70 pt-2 text-center min-w-24">{game.visitingTeam.city}</p>
                  <p className="text-gray-700 text-sm opacity-50 text-center">Visiting</p>
                </div>
                <div style={{ minWidth: '30px' }}></div>
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.homeTeam.logo} alt="home team logo" />
                  <p className="text-sm opacity-70 pt-2 text-center min-w-24">{game.homeTeam.city}</p>
                  <p className="text-gray-700 text-sm opacity-50 text-center">Home</p>
                </div>
              </div>
              {officialsData && <GameAssignment game={game} officialsData={officialsData[game.id]} />}
            </div>
          </div>        
        ))}
      </div>
    </div>
  );
};

export default SelectedGames;
