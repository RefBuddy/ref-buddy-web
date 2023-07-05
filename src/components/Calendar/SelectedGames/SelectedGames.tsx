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
      console.log("Game", game);
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
    minDate: new Date("2023-09-01"),
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
  
  return (
    <div className="mt-6">
      <div className="flex flex-row items-center gap-2 flex-wrap max-w-2/3">
      {selectedGames.map(game => (
        <div key={game.id} className="w-full flex items-center justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm px-2.5 py-1 mx-4">
          <div className="flex flex-1 flex-col items-start justify-center gap-3">
            <div className="flex items-center justify-between">
              <p className="font-bold mb-1 mt-[-5px]">{gameData && gameData.gameNumber === game.gameNumber ? gameData.newDate : game.date.slice(0, -6)} @ {gameData && gameData.gameNumber === game.gameNumber ? formatTime(gameData.newISO) : formatTime(game.time)}</p>
              <button className="border border-gray-300 rounded-md py-1 px-2 mx-4 mb-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => editingGame && editingGame.id === game.id ? handleSaveClick(game) : handleEditClick(game)}>{editingGame && editingGame.id === game.id ? "Save" : "Edit"}</button>
            </div>
            {editingGame && editingGame.id === game.id && (
              <>
                <Datepicker options={options} onChange={handleDateChange} show={show} setShow={handleClose} />
                <TimePicker onChange={handleTimeChange} value={selectedTime ? moment(selectedTime) : undefined} showSecond={false} format="h:mm a" use12Hours={true} />
              </>
            )}
            <div className="flex flex-row items-center gap-3 -mt-4">
              <div className="flex flex-col items-center justify-center">
                <img width={40} height={40} src={game.visitingTeam.logo} alt="visiting team logo" />
                <p className="text-sm text-black text-center min-w-24">{game.visitingTeam.city}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-bold mb-6">@</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img width={40} height={40} src={game.homeTeam.logo} alt="home team logo" />
                <p className="text-sm text-black text-center min-w-24">{game.homeTeam.city}</p>
              </div>
            </div>
          </div>
          <div className="flex-none">
            {officialsData && officialsData[game.id] && <GameAssignment gameData={game} />}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default SelectedGames;
