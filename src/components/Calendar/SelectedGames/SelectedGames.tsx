import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setSelectedGames } from '../../../store/Games/reducer';
import { fetchOfficialsProfiles, editGameDate } from '../../../store/Games/actions';
import Datepicker from "tailwind-datepicker-react"
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';
import { formatTime } from '../../../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { formatDate } from '../../../utils/helpers';

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
  
  const officialsData = useAppSelector(state => state.games.officialsData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingGame, setEditingGame] = useState<any | null>(null);
  // Time picker state
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  // Function for handling time changes
  const handleTimeChange = (value) => {
    setSelectedTime(value && value.toDate());
    console.log("selected time", selectedTime);
  }


  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  const handleEditClick = (game) => {
    setEditingGame(game);
    setSelectedDate(new Date(game.date));
    console.log("editing game", game.time.slice(11, 16));
  }

  const handleSaveClick = (game) => {
    if (selectedDate && editingGame) {
      console.log("Game", game);
      const timezone = editingGame.homeTeam.abbreviation === 'CRA' ? '-07:00' : '-08:00';

      const gameData: GameDateRequestData = {
        league: 'bchl',
        season: '2022-2023',
        date: game.time.slice(0, 10),
        gameNumber: game.gameNumber,
        newDate: selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        newISO: (selectedDate as Date).toISOString().slice(0, -5) + timezone
      };
      dispatch(editGameDate(gameData));
      setEditingGame(null);
      setSelectedDate(null);
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
    maxDate: new Date("2023-03-31"),
    minDate: new Date("2022-09-01"),
    theme: {
      // background: "bg-gray-700 dark:bg-gray-800",
      background: "bg-white",
      todayBtn: "",
      clearBtn: "",
      icons: "",
      text: "",
      // disabledText: "bg-gray-800",
      input: "",
      inputIcon: "",
      selected: "",
    },
    icons: {
      // () => ReactElement | JSX.Element
      prev: () => <ChevronLeftIcon className="h-6 w-6"/>,
      next: () => <ChevronRightIcon className="h-6 w-6"/>,
    },
    datepickerClassNames: "top-12",
    defaultDate: selectedDate,
    language: "en",
  };
  
  return (
    <div className="mt-6">
      <div className="flex flex-row items-center gap-4 flex-wrap max-w-2/3">
      {selectedGames.map(game => (
          <div key={game.id} className="w-full flex items-center justify-center gap-3 border-gray-200 border-solid border rounded shadow-sm p-5 mx-4">
            <div className="flex flex-1 flex-col items-start justify-center gap-3">
              <p className="font-bold mb-1 mt-[-5px]">{game.date.slice(0, -6)} @ {formatTime(game.time)}</p>
              {editingGame && editingGame.id === game.id ? (
                <>
                  <Datepicker options={options} onChange={handleDateChange} show={show} setShow={handleClose} />
                  <TimePicker onChange={handleTimeChange} value={selectedTime ? moment(selectedTime) : undefined} showSecond={false} format="h:mm a" use12Hours={true} defaultValue={editingGame.time.slice(11, 16)}/>
                  <button className="..." onClick={() => handleSaveClick(game)}>Save</button>
                </>
              ) : (
                <button className="..." onClick={() => handleEditClick(game)}>Edit</button>
              )}
              <div className="flex flex-row items-center gap-3">
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.visitingTeam.logo} alt="visiting team logo" />
                  <p className="text-sm text-black pt-2 text-center min-w-24">{game.visitingTeam.city}</p>
                  <p className="text-gray-700 text-sm opacity-50 text-center">Visiting</p>
                </div>
                <div className="min-w-[30px]"></div>
                <div className="flex flex-col items-center justify-center">
                  <img width={70} height={70} src={game.homeTeam.logo} alt="home team logo" />
                  <p className="text-sm text-black pt-2 text-center min-w-24">{game.homeTeam.city}</p>
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
