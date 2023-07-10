import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchOfficialsProfiles, editGameDate } from '../../../store/Games/actions';
import Datepicker from "tailwind-datepicker-react"
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment-timezone';
import { formatTime } from '../../../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import './App.css';
import { GameAssignment } from './GameAssignment';
import { Button } from '../../Button';
import CreateGame from '../CreateGame/CreateGame';
import { resetSavedGameState } from '../../../store/Games/reducer';

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
  
  const officialsData = useAppSelector(state => state.games.officialsData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingGame, setEditingGame] = useState<any | null>(null);
  // Time picker state
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [gameData, setGameData] = useState<GameDateRequestData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Show the create view
  const [showCreate, setShowCreate] = useState<boolean>(false);

  // Function for handling time changes
  const handleTimeChange = (value) => {
    setSelectedTime(value && value.toDate());
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const handleEditClick = (game) => {
    setEditingGame(game);
    setIsEditing(true);
    if (gameData && gameData.gameNumber === game.gameNumber) {
      // If there is gameData for this game, initialize the selectedDate and selectedTime with the new date and time
      setSelectedDate(new Date(gameData.newDate));
      setSelectedTime(moment(gameData.newISO) && moment(gameData.newISO).toDate());
    } else {
      // Otherwise, initialize with the original date and time
      setSelectedDate(new Date(game.date));
      setSelectedTime(moment(game.time) && moment(game.time).toDate());
    }
  }  

  const handleSaveClick = (game) => {
    if (selectedDate && editingGame) {
      const timezone = editingGame.homeTeam.abbreviation === 'CRA' ? 'America/Denver' : 'America/Los_Angeles';
      let ISO = "";
      if (selectedTime) {
        // Create a moment object from the selected time
        const selectedMoment = moment(selectedTime);
  
        // Combine date from selectedDate and time from selectedTime
        selectedDate.setHours(selectedMoment.hours());
        selectedDate.setMinutes(selectedMoment.minutes());
        selectedDate.setSeconds(selectedMoment.seconds());
  
        // Create a moment object from the combined date and time and format it to an ISO string in the correct timezone
        ISO = moment(selectedDate).tz(timezone).format();
      } else {
        // If selectedTime is null, just convert the selected date to an ISO string
        ISO = moment(selectedDate).tz(timezone).format();
      }

      const updatedGameData: GameDateRequestData = {
        league: 'bchl',
        season: '2023-2024',
        date: game.time.slice(0, 10),
        gameNumber: game.gameNumber,
        newDate: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        newISO: ISO
      };
      setGameData(updatedGameData);
      dispatch(editGameDate(updatedGameData));
      setEditingGame(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setIsEditing(false);
    }
  }

  const handleCancelClick = () => {
    setEditingGame(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsEditing(false);
  }  
  
  const [show, setShow] = useState(false)
  const handleClose = (state: boolean) => {
    setShow(state)
  }

  const options = {
    title: "",
    autoHide: true,
    todayBtn: false,
    clearBtn: false,
    maxDate: new Date("2024-03-31"),
    minDate: new Date("2023-07-01"),
    theme: {
      // background: "bg-gray-700 dark:bg-gray-800",
      background: "bg-white",
      todayBtn: "",
      clearBtn: "",
      icons: "",
      text: "",
      // disabledText: "bg-gray-800",
      input: "datepicker-input",
      inputIcon: "",
      selected: "",
    },
    icons: {
      // () => ReactElement | JSX.Element
      prev: () => <ChevronLeftIcon className="h-6 w-6"/>,
      next: () => <ChevronRightIcon className="h-6 w-6"/>,
    },
    datepickerClassNames: "center-datepicker",
    defaultDate: selectedDate,
    language: "en",
  };

  const onCreateGameClose = () => {
    setShowCreate(false)
    dispatch(resetSavedGameState());
  }
  
  return (
    <div className="mt-6">
      <div className="flex flex-row items-center gap-2 flex-wrap max-w-2/3 w-full">
      {!showCreate && selectedGames.map(game => (
        <div key={game.id} className="w-full flex flex-col items-start justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm px-2.5 py-1 mx-4">
          <div className="flex items-center w-full">
            <div className="flex items-center gap-2">
              {editingGame && editingGame.id === game.id ? null : 
                <p className="font-bold ">{gameData && gameData.gameNumber === game.gameNumber ? gameData.newDate : game.date.slice(0, -6)} - {gameData && gameData.gameNumber === game.gameNumber ? formatTime(gameData.newISO) : formatTime(game.time)} - {game.venue}</p>
              }
              {editingGame && editingGame.id === game.id ? null : 
                <button className="border border-gray-300 rounded-md py-1 px-2 mx-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleEditClick(game)}>Edit</button>
              }
            </div>
          </div>
          {editingGame && editingGame.id === game.id && (
            <div className="flex items-center">
              <Datepicker options={options} onChange={handleDateChange} show={show} setShow={handleClose} />
              <TimePicker className="-ml-12" onChange={handleTimeChange} value={selectedTime ? moment(selectedTime) : undefined} showSecond={false} format="h:mm a" use12Hours={true} />
              <button className="border border-gray-300 rounded-md py-1 px-2 ml-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleSaveClick(game)}>Save</button>
              <button className="border border-gray-300 rounded-md py-1 px-2 ml-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => handleCancelClick()}>Cancel</button>
            </div>
          )}
          <div className="flex w-full -mt-2 items-center justify-between">
              <div className="flex flex-row items-center gap-3">
                  <div className="flex flex-col items-center justify-center">
                      <img width={40} height={40} src={game.visitingTeam.logo} alt="visiting team logo" />
                      <p className="text-sm text-black text-center min-w-24">{game.visitingTeam.city}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <div className="text-xl font-bold mb-5">@</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                      <img width={40} height={40} src={game.homeTeam.logo} alt="home team logo" />
                      <p className="text-sm text-black text-center min-w-24">{game.homeTeam.city}</p>
                  </div>
              </div>
              <div className="flex-none pb-1">
                  {officialsData && officialsData[game.id] && <GameAssignment gameData={game} />}
              </div>
          </div>
      </div>    
      ))}
      {showCreate && (
        <CreateGame onClose={() => onCreateGameClose()} />
      )}
      {!showCreate && <Button onClick={() => setShowCreate(true)}>Create New Game</Button>}
      </div>
    </div>
  );
};

export default SelectedGames;
