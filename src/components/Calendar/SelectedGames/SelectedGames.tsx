import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSelectedGames } from '../../../store/Games/reducer';
import { fetchOfficialsProfiles, editGameDate } from '../../../store/Games/actions';
import DateTimePicker from 'react-datetime-picker';
import { formatTime } from '../../../utils/helpers';

const UserProfile = ({ userData }) => {
  const name = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        className="rounded-full max-w-[80px] max-h-[80px] object-cover h-[80px] w-[80px]"
        width={80}
        height={80}
        src={userData.profilePictureUrl}
        alt={name}
      />
      <p className={`text-center pt-3`}>{name}</p>
    </div>
  );
};

const OfficialBox = ({ official, label, color }) => {
  const handleClick = () => {
    // ... handle click on box
  };

  return (
    <div 
      className="flex flex-col items-center justify-center border-2 rounded-md p-3 mx-1 cursor-pointer"
      style={{ borderColor: color, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', minWidth: '130px', minHeight: '160px' }}
      onClick={handleClick}
    >
      {official ?
        <UserProfile userData={official}/> :
        <div>Add {label}</div>}
    </div>
  );
};

const GameAssignment = ({ officialsData }) => {

  return (
    <div className="flex">
      <OfficialBox official={officialsData.official1} label="Referee" color="orange" />
      <OfficialBox official={officialsData.official2} label="Referee" color="orange" />
      <OfficialBox official={officialsData.official3} label="Linesman" color="black" />
      <OfficialBox official={officialsData.official4} label="Linesman" color="black" />
    </div>
  );
};

const SelectedGames = () => {
  const dispatch = useAppDispatch();
  const selectedGames = useAppSelector(state => state.games.selectedGames)

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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingGame, setEditingGame] = useState<any | null>(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const handleEditClick = (game) => {
    setEditingGame(game);
    setSelectedDate(new Date(game.date));
  }

  const handleSaveClick = (game) => {
    if (selectedDate && editingGame) {
      console.log("Game", game);
      const gameData: GameDateRequestData = {
        league: 'bchl',
        season: '2022-2023',
        date: game.time.slice(0, 10),
        gameNumber: game.gameNumber,
        newDate: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        newISO: (selectedDate as Date).toISOString().slice(0, -1) 
      };
      dispatch(editGameDate(gameData));
      setEditingGame(null);
      setSelectedDate(null);
    }
  }
  
  
  return (
    <div className="mt-6">
      <div className="flex flex-row items-center gap-4 flex-wrap max-w-2/3">
      {selectedGames.map(game => (
          <div key={game.id} className="w-full flex items-center justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm p-5 mx-4">
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <p className="font-bold mb-1 mt-[-5px]">{game.date.slice(0, -6)} @ {formatTime(game.time)}</p>
              {editingGame && editingGame.id === game.id ? (
                <>
                  <DateTimePicker
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="..."
                  />
                  <button className="..." onClick={() => handleSaveClick(game)}>Save</button>
                </>
              ) : (
                <button className="..." onClick={() => handleEditClick(game)}>Edit</button>
              )}
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.visitingTeam.logo} alt="visiting team logo" />
                  <p className="text-sm text-gray-500 pt-2 text-center min-w-24">{game.visitingTeam.city}</p>
                  <p className="text-gray-700 text-sm opacity-50 text-center">Visiting</p>
                </div>
                <div className="min-w-[30px]"></div>
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.homeTeam.logo} alt="home team logo" />
                  <p className="text-sm text-gray-500 pt-2 text-center min-w-24">{game.homeTeam.city}</p>
                  <p className="text-gray-700 text-sm opacity-50 text-center">Home</p>
                </div>
              </div>
            </div>
            <div className="flex-none">
              {officialsData && officialsData[game.id] && <GameAssignment officialsData={officialsData[game.id]} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedGames;
