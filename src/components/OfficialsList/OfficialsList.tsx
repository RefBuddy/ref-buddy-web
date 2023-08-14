import React, { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store';
import { addToQueue } from '../../store/Games/actions';
import { incrementQueueCount } from '../../store/OfficialsList/reducer';
import { decrementCount } from '../../store/OfficialsList/reducer';
import { removeFromGame } from '../../store/Games/actions';
import { formatDate } from '../../utils/helpers';
import {
  getUserCalendarEvents,
  getAllOfficialsCalendarEvents,
  getOfficialsStats,
} from '../../store/User/actions';
import { Button } from '../Button';
import { format24HourTime } from '../../utils/helpers';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const OfficialsList = ({ game, role, isAssigned, close = () => {} }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const [officialClicked, setOfficialClicked] = useState('');
  const [officialsData, setOfficialsData] = useState<OfficialData | null>(null);
  const {
    officialsCalendarData,
    assignedGames,
    queuedGames,
    blockedOffTimes,
    officialsStats,
  } = useAppSelector((state) => state.user);
  const league = useAppSelector((state) => state.games.currentLeague);
  const season = useAppSelector((state) => state.games.currentSeason);
  const date = game.time.slice(0, 10);
  const gameNumber = game.gameNumber;
  const label =
    isAssigned !== false
      ? isAssigned.name
      : role === 'referee1' || role === 'referee2'
      ? 'Referee'
      : role === 'supervisor'
      ? 'Supervisor'
      : 'Linesman';
  const roleDetails =
    role === 'referee1' || role === 'referee2'
      ? 'Referee'
      : role === 'supervisor'
      ? 'Supervisor'
      : 'Linesman';

  const officials =
    role === 'supervisor'
      ? useAppSelector((state) => state.officials.supervisorsList)
      : useAppSelector((state) => state.officials.officialsList);

  // this hook converts the officials object to an array and sorts it when the component mounts
  useEffect(() => {
    const officialsArray = Object.keys(officials).map((key) => officials[key]);
    // const sortedOfficials = officialsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
    const sortedOfficials = officialsArray.sort((a, b) => {
      if (a.lastName && b.lastName) {
        return a.lastName.localeCompare(b.lastName);
      } else if (a.lastName) {
        return -1; // a comes first if b.lastName is undefined
      } else if (b.lastName) {
        return 1; // b comes first if a.lastName is undefined
      } else {
        return 0; // both are undefined, so they are considered equal
      }
    });

    setSortedData(sortedOfficials);
  }, []);

  useEffect(() => {
    if (role !== 'dashboard') {
      dispatch(getAllOfficialsCalendarEvents({ gameDate: date }));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const searchTermLowerCase = e.target.value.toLowerCase();

    const officialsArray = Object.keys(officials).map((key) => officials[key]);

    const filtered = officialsArray.filter(
      (official: any) =>
        official.firstName.toLowerCase().includes(searchTermLowerCase) ||
        official.lastName.toLowerCase().includes(searchTermLowerCase) ||
        official.city.toLowerCase().includes(searchTermLowerCase),
    );

    const sortedOfficials = filtered.sort((a: any, b: any) =>
      a.lastName.localeCompare(b.lastName),
    );
    setSortedData(sortedOfficials);
  };

  const handleAssignClick = async (e, uid) => {
    e.stopPropagation();

    // If isAssigned is not false, remove the already assigned official
    if (isAssigned) {
      await dispatch(
        removeFromGame({
          uid: isAssigned.uid,
          date: date,
          gameNumber: gameNumber,
          league: league,
          season: season,
        }),
      );
      dispatch(decrementCount(isAssigned.uid));
    }

    const gameData = {
      uid: uid,
      role: role,
      date: date,
      gameNumber: gameNumber,
      league: league,
      season: season,
    };

    // Dispatch the addToQueue action and await for it to finish
    await dispatch(addToQueue(gameData));

    // Increment the queue count for the official
    dispatch(incrementQueueCount(uid));

    // callback function to close the modal
    close();

    // Show toast message
    if (isAssigned) {
      toast.success(
        `${officials[uid].firstName} ${officials[uid].lastName} replaced ${isAssigned.name}`,
      );
    } else if (
      officials[uid].firstName === 'No' &&
      officials[uid].lastName === 'Supervisor'
    ) {
      toast.success(`Game has no supervisor.`);
    } else {
      toast.success(
        `${officials[uid].firstName} ${officials[uid].lastName} added to queue.`,
      );
    }
  };

  const gatherOfficialCalendarDataById = (uid: string) => {
    if (!officialsCalendarData || !officialsCalendarData[uid]) {
      return null;
    }

    const blockedOffDates = officialsCalendarData[uid].blockedOffTimes;
    const currentSelectedDate = parseISO(game.time);
    const formattedTime = formatDate(currentSelectedDate);

    try {
      return blockedOffDates[formattedTime];
    } catch (error) {
      return null;
    }
  };

  const assignedGamesOfOfficial = (uid: string) => {
    if (!officialsCalendarData || !officialsCalendarData[uid]) {
      return null;
    }

    let assignedGames = officialsCalendarData[uid].assignedGames || {};
    const queuedGames = officialsCalendarData[uid].queuedGames || {};
    const currentSelectedDate = parseISO(game.time);
    const formattedTime = formatDate(currentSelectedDate);

    // add queued games to assigned games
    if (queuedGames && queuedGames[formattedTime]) {
      // Create a copy of assignedGames to prevent mutation of the original data
      assignedGames = { ...assignedGames };
      assignedGames[formattedTime] = queuedGames[formattedTime];
    }

    try {
      return assignedGames[formattedTime];
    } catch (error) {
      return null;
    }
  };

  const isOfficialHovered = (uid) => officialHovered === uid;

  const handleClick = (e, uid) => {
    e.stopPropagation();
    if (isOfficialHovered(uid)) {
      const filteredOfficialProfileInfoKey = Object.keys(officials).filter(
        (key) => key === uid,
      );
      if (filteredOfficialProfileInfoKey.length > 0) {
        const filterOfficialProfile =
          officials[filteredOfficialProfileInfoKey[0]];
        setOfficialsData(filterOfficialProfile);
        setOfficialClicked(uid);
        dispatch(getUserCalendarEvents({ uid: uid }));
        // const statProps = {
        //   league: 'bchl',
        //   season: '2022-2023',
        //   name: `${filterOfficialProfile.firstName} ${filterOfficialProfile.lastName}`
        // }
        // dispatch(getOfficialsStats(statProps));
      }
    }
  };

  const getFormattedTime = (isoTime: string) => {
    const date = new Date(isoTime);
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <>
      {/* teams and game time */}
      <div className="flex items-center justify-between w-full -mt-6 -mb-3">
        {role != 'dashboard' ? (
          <div className="flex w-full items-center justify-start p-4">
            <div className="flex flex-row items-center gap-2 ml-6">
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
              <div className="flex flex-col -mb-2">
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1">
                  {getFormattedTime(game.time)}
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
        ) : (
          <div className="w-full h-6 bg-white"></div>
        )}
        {role != 'dashboard' ? (
          <div
            className={`flex flex-col items-center justify-center border-2 rounded-md p-1 -mt-2 cursor-pointer relative min-h-12 flex-none w-36 shadow-md ${
              roleDetails === 'Referee'
                ? 'border-orange-500'
                : roleDetails === 'Linesman'
                ? 'border-black'
                : ''
            }`}
          >
            <div>{label}</div>
          </div>
        ) : (
          <div className="mb-14 bg-white"></div>
        )}
      </div>

      {/* Main OfficialsList container */}
      <div className="w-full bg-white border border-gray-300 rounded-md max-h-[600px] overflow-y-auto">
        <div className="py-4 px-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        {sortedData.map((official: any, index) => {
          const assignedGamesAlready = assignedGamesOfOfficial(official.uid);
          const blockedOffDatesAlready = gatherOfficialCalendarDataById(
            official.uid,
          );
          return (
            <div
              key={`official-${official.uid}`}
              onMouseOver={() => setOfficialHovered(official.uid)}
              onClick={(e) => handleClick(e, official.uid)}
              className={`cursor-pointer hover:bg-gray-100 flex flex-col items-start p-2 ${
                index < sortedData.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="grid grid-cols-[.65fr,.25fr,.35fr,1fr,1fr] gap-4 w-full items-center">
                {' '}
                {/* First column: official details */}
                <div className="flex items-center gap-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={official.profilePictureUrl}
                    alt="official"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-600">
                      {official.firstName} {official.lastName}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      {official.city}
                    </p>
                  </div>
                </div>
                {/* Second column: @ already assigned abbreviation */}
                <div>
                  {assignedGamesAlready && assignedGamesAlready.length > 0 && (
                    <div className="flex items-center">
                      <p
                        className={`text-sm font-normal ${
                          assignedGamesAlready.length > 0
                            ? 'text-error-500'
                            : 'text-gray-900'
                        }`}
                      >
                        <strong>
                          @ {assignedGamesAlready[0].home_team.abbreviation}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
                {/* Third column: counts */}
                <div className="flex flex-col items-start gap-2">
                  {' '}
                  {/* Use flex-column for vertical alignment */}
                  <div className="flex flex-row items-end gap-2">
                    <p className="text-sm border border-green-500 rounded-md px-2 py-1">
                      {official.assignedCount
                        ? official.assignedCount.toString()
                        : '0'}
                    </p>
                    <p className="text-sm border border-warning-300 rounded-md px-2 py-1">
                      {official.queueCount
                        ? official.queueCount.toString()
                        : '0'}
                    </p>
                  </div>
                </div>
                {/* Fourth column: blocked off dates */}
                <div>
                  {blockedOffDatesAlready &&
                    blockedOffDatesAlready.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {' '}
                        {/* Use flex-column for vertical alignment */}
                        {blockedOffDatesAlready.map((times, index) => (
                          <React.Fragment key={index}>
                            <div className="flex items-center gap-2">
                              {times.startTime === '00:00' &&
                              times.endTime === '23:59' ? (
                                <p className="h-6 w-6 text-warning-300">❌</p>
                              ) : (
                                <ExclamationTriangleIcon className="h-6 w-6 text-warning-300" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-black">
                                  {times.startTime === '00:00' &&
                                  times.endTime === '23:59' ? (
                                    <span className="text-gray-700">
                                      Not Available
                                    </span>
                                  ) : (
                                    <span className="text-gray-700">
                                      {format24HourTime(times.startTime)} -{' '}
                                      {format24HourTime(times.endTime)}
                                    </span>
                                  )}
                                  <br />
                                  <span className="text-gray-700">
                                    {times.notes}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                </div>
                {/* Fifth column: assign button */}
                <div className="justify-self-end mr-4">
                  {' '}
                  {/* Added justify-self-end */}
                  {isOfficialHovered(official.uid) && date !== '2021-10-10' && (
                    <Button onClick={(e) => handleAssignClick(e, official.uid)}>
                      {isAssigned ? 'Replace Official' : 'Assign + '}
                    </Button>
                  )}
                </div>
              </div>

              {officialClicked === official.uid && officialsData && (
                <div className="mt-4 flex flex-col">
                  {assignedGames && (
                    <div className="flex flex-row flex-1 justify-between">
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
                      <div className="h-auto w-52">
                        <p className="text-xs mt-4 font-bold">Queued Games</p>
                        <table className="mt-2 max-h-[300px] h-auto overflow-y-auto w-44">
                          <thead>
                            <tr className="text-xs font-medium text-black">
                              <td>Date</td>
                              <td>Game</td>
                            </tr>
                          </thead>
                          <tbody>
                            {queuedGames &&
                              Object.keys(queuedGames).map((dateKey) => (
                                <>
                                  {queuedGames[dateKey].map((game) => (
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
                      <div className="h-auto">
                        <p className="text-xs mt-4 font-bold">Dark Days</p>
                        <table className="mt-2 max-h-[300px] h-auto overflow-y-auto w-full">
                          <thead>
                            <tr className="text-xs font-medium text-black">
                              <td className="w-24">Date</td>
                              <td className="w-16">Time</td>
                              <td className="pl-4">Notes</td>
                            </tr>
                          </thead>
                          <tbody>
                            {blockedOffTimes &&
                              Object.keys(blockedOffTimes).map((dateKey) => (
                                <>
                                  {blockedOffTimes[dateKey].map(
                                    (block, index) => (
                                      <tr
                                        key={`block-${dateKey}-${index}`}
                                        className="text-xs font-body text-gray-700"
                                      >
                                        <td>{dateKey}</td>
                                        <td>
                                          {block.startTime === '00:00' && block.endTime === '23:59' ? (
                                            <p className='pl-4'>❌</p>
                                          ) : (
                                            <span className="text-gray-700">
                                              {format24HourTime(block.startTime)} - {format24HourTime(block.endTime)}
                                            </span>
                                          )}
                                        </td>
                                        <td className="pl-4">{block.notes}</td>
                                      </tr>
                                    ),
                                  )}
                                </>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OfficialsList;
