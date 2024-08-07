import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchOfficialsProfiles,
  editGameDate,
  deleteGame,
} from '../../../store/Games/actions';
import { releaseGame } from '../../../store/Assigning/actions';
import { incrementAssignedCount } from '../../../store/OfficialsList/reducer';
import { setSelectedGames } from '../../../store/Games/reducer';
import Datepicker from 'tailwind-datepicker-react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment-timezone';
import { formatTime } from '../../../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import './App.css';
import { GameAssignment } from './GameAssignment';
import { Button } from '../../Button';
import { resetSavedGameState } from '../../../store/Games/reducer';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Loading } from '../../../components/Loading';
import { TextInput } from '../../../components/TextInput';
import { current } from '@reduxjs/toolkit';
import { ConfirmationModal } from '../../ConfirmationModal';

const SelectedGames = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const selectedGames = useAppSelector((state) => state.games.selectedGames);
  const { currentLeague, currentSeason } = useAppSelector(
    (state) => state.user,
  );
  const isLoading = useAppSelector((state) => state.games.loading);
  const handleCloseSelectedGames = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    // Dispatch action to fetch officials data
    selectedGames.forEach((game) => {
      const gameId = game.id;
      let officials = game.officials;
      dispatch(fetchOfficialsProfiles({ officials, gameId }));
    });
  }, [selectedGames]);

  const officialsData = useAppSelector((state) => state.games.officialsData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingGame, setEditingGame] = useState<GameData | null>(null);
  const [gameToDelete, setGameToDelete] = useState<GameData | null>(null);
  // Time picker state
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [gameData, setGameData] = useState<GameDateRequestData | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const events = useAppSelector((state) => state.games.monthGameData);
  // Show the create view
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [showDeleteGameModal, setShowDeleteGameModal] =
    useState<boolean>(false);
  const minorLogo =
    currentLeague === 'somha'
      ? 'https://i.etsystatic.com/17942801/r/il/3a3e5a/1634913575/il_1588xN.1634913575_56tq.jpg'
      : currentLeague === 'lusa'
      ? 'https://cdn.pixabay.com/photo/2013/07/13/10/51/football-157930_1280.png'
      : null; // Replace with a default logo URL if needed

  // Function for handling time changes
  const handleTimeChange = (value) => {
    setSelectedTime(value && value.toDate());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleEditClick = (game) => {
    setIsEditing(true);
    setEditingGame(game);
    if (gameData && gameData.gameNumber === game.gameNumber) {
      // If there is gameData for this game, initialize the selectedDate and selectedTime with the new date and time
      setSelectedDate(new Date(gameData.newDate));
      setSelectedTime(
        moment(gameData.newISO) && moment(gameData.newISO).toDate(),
      );
    } else {
      // Otherwise, initialize with the original date and time
      setSelectedDate(new Date(game.date));
      setSelectedTime(moment(game.time) && moment(game.time).toDate());
    }
  };

  const handleDeleteGameClick = async () => {
    if (gameToDelete) {
      try {
        const deleteGameData: DeleteGameRequestData = gameToDelete.officials
          .length
          ? {
              officials: gameToDelete.officials.map((official) => ({
                uid: official.uid,
                date: gameToDelete.time.slice(0, 10),
                gameNumber: gameToDelete.gameNumber,
                league: currentLeague,
                season: currentSeason,
              })),
            }
          : {
              officials: [
                {
                  uid: '',
                  date: gameToDelete.time.slice(0, 10),
                  gameNumber: gameToDelete.gameNumber,
                  league: currentLeague,
                  season: currentSeason,
                },
              ],
            };
        setShowDeleteGameModal(false);
        await dispatch(deleteGame(deleteGameData));
        handleCloseSelectedGames();
        setGameToDelete(null);

        toast.success('Game successfully deleted');
      } catch (error) {
        toast.error('Error deleting game');
      }
    } else {
      toast.error('Error deleting game');
    }
  };

  const handleSaveClick = (game) => {
    if (selectedDate && editingGame) {
      const timezone =
        editingGame.homeTeam.abbreviation === 'CRA'
          ? 'America/Denver'
          : 'America/Los_Angeles';
      let ISO = '';
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
        league: currentLeague,
        season: currentSeason,
        date: game.time.slice(0, 10),
        gameNumber: game.gameNumber,
        newDate: selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        newISO: ISO,
        venue: editingGame?.venue ?? game.venue,
      };
      setGameData(updatedGameData);
      dispatch(editGameDate(updatedGameData));
      setEditingGame(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setIsEditing(false);

      toast.success('Game successfully updated');
    } else {
      toast.error('Error updating game');
    }
  };

  const handleCancelClick = () => {
    setEditingGame(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsEditing(false);
  };

  const [show, setShow] = useState(false);
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const options = {
    title: '',
    autoHide: true,
    todayBtn: false,
    clearBtn: false,
    maxDate: new Date('2024-07-01'),
    minDate: new Date('2025-07-01'),
    theme: {
      // background: "bg-gray-700 dark:bg-gray-800",
      background: 'bg-white',
      todayBtn: '',
      clearBtn: '',
      icons: '',
      text: '',
      // disabledText: "bg-gray-800",
      input: 'datepicker-input',
      inputIcon: '',
      selected: '',
    },
    icons: {
      // () => ReactElement | JSX.Element
      prev: () => <ChevronLeftIcon className="h-6 w-6" />,
      next: () => <ChevronRightIcon className="h-6 w-6" />,
    },
    datepickerClassNames: 'center-datepicker',
    defaultDate: selectedDate,
    language: 'en',
  };

  const getBorderColor = (game) => {
    if (
      game.officials &&
      game.officials.length === 5 &&
      game.officials.every((official) => official['status'].confirmed === true)
    ) {
      return { color: 'border-green-500' };
    } else if (
      game.officials &&
      game.officials.length === 5 &&
      game.officials.filter((official) => official['status'].confirmed === true)
        .length < 5 &&
      game.officials.every((official) => official['status'].declined === false)
    ) {
      return { color: 'border-warning-300' };
    } else if (
      (game.officials && game.officials.length < 5) ||
      (game.officials &&
        game.officials.some((official) => official['status'].declined === true))
    ) {
      return { color: 'border-error-400' };
    } else {
      return { color: 'border-gray-200' };
    }
  };

  const release = (game: GameData) => {
    const timezone =
      game.homeTeam && game.homeTeam.abbreviation === 'CRA'
        ? 'America/Denver'
        : 'America/Los_Angeles';
    const ISO = moment(game.time).tz(timezone).format('YYYY-MM-DD');
    const data = {
      uids: game.officials.map((off) => off.uid),
      date: ISO,
      gameNumber: game.gameNumber,
      league: currentLeague,
      season: currentSeason,
    } as ReleaseGameRequestData;
    dispatch(releaseGame(data));
    dispatch(incrementAssignedCount(data.uids));
  };

  const getGamesByDirection = (direction: 'next' | 'prev') => {
    if (!events || !selectedGames.length) return;

    // Determine the increment based on direction
    const increment = direction === 'next' ? 1 : -1;

    // Get the game with the relevant time from selectedGames based on direction
    const relevantGame = selectedGames.reduce((prev, current) =>
      direction === 'next'
        ? prev.time > current.time
          ? prev
          : current
        : prev.time < current.time
        ? prev
        : current,
    );

    // Calculate the day based on direction from the relevant game's date
    const startKeyDate = new Date(relevantGame.time.slice(0, 10));
    startKeyDate.setDate(startKeyDate.getDate() + increment);
    let startKey = format(startKeyDate, 'yyyy-MM-dd');

    let gamesDuringSlots: GameData[] = [];
    while (gamesDuringSlots.length === 0) {
      const allEventsDuringSlots = Object.keys(events).filter((key) => {
        const keyDate = new Date(key);
        return keyDate.getTime() === startKeyDate.getTime();
      });

      gamesDuringSlots = [];
      allEventsDuringSlots.forEach((key) => {
        const gamesOnDate = events[key] as GameData[];
        gamesOnDate.forEach((game) => {
          gamesDuringSlots.push(game);
        });
      });

      if (gamesDuringSlots.length === 0) {
        startKeyDate.setDate(startKeyDate.getDate() + increment);
        startKey = format(startKeyDate, 'yyyy-MM-dd');

        // check if the new date is in the same month as the current date
        const currentMonth = new Date(relevantGame.time.slice(0, 7));
        const newMonth = new Date(startKey.slice(0, 7));
        if (currentMonth.getTime() !== newMonth.getTime()) {
          toast.error('Can only quick change date within the same month');
          return;
        }
      }
    }

    dispatch(setSelectedGames(gamesDuringSlots));
  };

  return (
    <>
      <div className="mt-6">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 -mt-6">
              <button
                className="border border-gray-300 rounded-md py-1 px-2.5 ml-16 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => getGamesByDirection('prev')}
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <p className="text-lg font-bold">Selected Games</p>
              <button
                className="border border-gray-300 rounded-md py-1 px-2.5 mr-16 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => getGamesByDirection('next')}
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-row items-center gap-2 flex-wrap max-w-2/3 w-full">
              {!showCreate &&
                [...selectedGames].map((game) => (
                  <div
                    key={game.id}
                    className={`w-full flex flex-col items-start justify-center gap-3 border-solid border rounded px-2.5 py-1 mx-4 ${
                      getBorderColor(game).color
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {editingGame && editingGame.id === game.id ? null : (
                          <p className="font-bold">
                            {gameData && gameData.gameNumber === game.gameNumber
                              ? gameData.newDate
                              : game.date.slice(0, -6)}{' '}
                            -{' '}
                            {gameData && gameData.gameNumber === game.gameNumber
                              ? formatTime(gameData.newISO)
                              : formatTime(game.time)}{' '}
                            -{' '}
                            {gameData &&
                            gameData.gameNumber === game.gameNumber &&
                            gameData.venue
                              ? gameData.venue
                              : game.venue}
                            {game.homeTeam.location
                              ? ` - ${game.homeTeam.location}`
                              : null}
                            {game.homeTeam.age_group
                              ? ` - ${game.homeTeam.age_group}`
                              : null}
                          </p>
                        )}
                        {editingGame && editingGame.id === game.id ? null : (
                          <button
                            className="border border-gray-300 rounded-md py-0.5 px-1.5 ml-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => handleEditClick(game)}
                          >
                            Edit
                          </button>
                        )}
                        {!isEditing && (
                          <button
                            className="border border-gray-300 rounded-md py-0.5 px-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => {
                              setGameToDelete(game);
                              setShowDeleteGameModal(true);
                            }}
                          >
                            Delete Game
                          </button>
                        )}
                      </div>
                      {(currentLeague !== 'bchl' && game.queue) ||
                      (game.queue && game.officials.length === 5) ? (
                        <Button onClick={() => release(game)}>Release</Button>
                      ) : (currentLeague !== 'bchl' && !game.queue) ||
                        (!game.queue && game.officials.length === 5) ? (
                        <p>Released ✅</p>
                      ) : null}
                    </div>
                    {editingGame && editingGame.id === game.id && (
                      <div className="flex items-center -mt-4">
                        <Datepicker
                          options={options}
                          onChange={handleDateChange}
                          show={show}
                          setShow={handleClose}
                        />
                        <TimePicker
                          className="-ml-20 w-48"
                          onChange={handleTimeChange}
                          value={
                            selectedTime ? moment(selectedTime) : undefined
                          }
                          showSecond={false}
                          format="h:mm a"
                          use12Hours={true}
                        />
                        <TextInput
                          className="ml-5"
                          label="Venue"
                          placeholder="Venue"
                          value={editingGame?.venue}
                          setValue={(value) => {
                            if (editingGame) {
                              const updatedGame = {
                                ...editingGame,
                                venue: value,
                              };
                              setEditingGame(updatedGame);
                            }
                          }}
                        />
                        <button
                          className="border border-gray-300 rounded-md py-0.5 px-1.5 ml-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleSaveClick(editingGame ?? game)}
                        >
                          Save
                        </button>
                        <button
                          className="border border-gray-300 rounded-md py-0.5 px-1.5 ml-1 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => handleCancelClick()}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <div className="flex w-full -mt-2 items-center justify-between">
                      <div className="flex flex-row items-center">
                        <div className="flex flex-col items-center justify-center">
                          <img
                            width={40}
                            height={40}
                            src={game.visitingTeam.logo ?? minorLogo}
                            alt="visiting team logo"
                          />
                          <p className="text-sm text-black text-center min-w-24">
                            {game.visitingTeam.city ??
                              game.visitingTeam.team_name}
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xl font-bold mb-5">@</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <img
                            width={40}
                            height={40}
                            src={game.homeTeam.logo ?? minorLogo}
                            alt="home team logo"
                          />
                          <p className="text-sm text-black text-center min-w-24">
                            {game.homeTeam.city ?? game.homeTeam.team_name}
                          </p>
                        </div>
                      </div>
                      <div className="w-auto pb-1">
                        {officialsData && officialsData[game.id] && (
                          <GameAssignment gameData={game} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              {showDeleteGameModal && !isEditing && (
                <ConfirmationModal
                  isOpen={showDeleteGameModal}
                  title="This action cannot be undone"
                  mainText="Everyone assigned to this game will be notified
                  that they have been removed and the game will be
                  deleted."
                  onCancel={() => setShowDeleteGameModal(false)}
                  onConfirm={handleDeleteGameClick}
                />
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SelectedGames;
