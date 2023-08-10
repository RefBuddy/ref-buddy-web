import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store';
import { addToQueue } from '../../store/Games/actions';
import { incrementQueueCount } from '../../store/OfficialsList/reducer';
import { formatDate } from "../../utils/helpers";
import { getUserCalendarEvents, getAllOfficialsCalendarEvents, getOfficialsStats } from "../../store/User/actions";
import { Button } from "../Button";
import { format24HourTime } from '../../utils/helpers';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const OfficialsList = ({ game, role, isAssigned, close = () => {} }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const [officialClicked, setOfficialClicked] = useState('');
  const [officialsData, setOfficialsData] = useState<OfficialData | null>(null);
  const { officialsCalendarData, assignedGames, queuedGames, officialsStats } = useAppSelector(state => state.user);
  const league = useAppSelector(state => state.games.currentLeague);
  const season = useAppSelector(state => state.games.currentSeason);
  const date = game.time.slice(0, 10);
  const gameNumber = game.gameNumber;
  const label = isAssigned !== false ? isAssigned : (role === 'referee1' || role === 'referee2' ? 'Referee' : role === 'supervisor' ? 'Supervisor' : 'Linesman');
  role = role === 'referee1' || role === 'referee2' ? 'Referee' : role === 'supervisor' ? 'Supervisor' : 'Linesman';
  
  const officials = role === 'supervisor' ? useAppSelector(state => state.officials.supervisorsList) : useAppSelector(state => state.officials.officialsList);

  // this hook converts the officials object to an array and sorts it when the component mounts
  useEffect(() => {
    const officialsArray = Object.keys(officials).map(key => officials[key]);
    const sortedOfficials = officialsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
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

    const officialsArray = Object.keys(officials).map(key => officials[key]);

    const filtered = officialsArray.filter(
      (official: any) =>
        official.firstName.toLowerCase().includes(searchTermLowerCase) ||
        official.lastName.toLowerCase().includes(searchTermLowerCase) ||
        official.city.toLowerCase().includes(searchTermLowerCase)
    );

    const sortedOfficials = filtered.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
    setSortedData(sortedOfficials);
  };

  const handleAssignClick = async (e, uid) => {
    e.stopPropagation();
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
    if (officials[uid].firstName === 'No' && officials[uid].lastName === 'Supervisor') {
      toast.success(`Game has no supervisor.`);
    } else {
      toast.success(`${officials[uid].firstName} ${officials[uid].lastName} added to queue.`);
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
      const filteredOfficialProfileInfoKey = Object.keys(officials).filter((key) => key === uid)
      if (filteredOfficialProfileInfoKey.length > 0) {
        const filterOfficialProfile = officials[filteredOfficialProfileInfoKey[0]]
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
        timeZoneName: 'short' 
    };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <>
      {/* teams and game time */}
      <div className="flex items-center justify-between w-full -mt-6 -mb-3">
        {role != 'dashboard' ?
          <div className="flex w-full items-center justify-start p-4">
            <div className="flex flex-row items-center gap-2 ml-6">
              <div className="flex flex-col items-center justify-center">
                <img width={40} height={40} src={game.visitingTeam.logo} alt="visiting team logo" />
                <p className="text-sm text-black text-center min-w-24">{game.visitingTeam.city}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-lg font-bold -mt-3">@</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img width={40} height={40} src={game.homeTeam.logo} alt="home team logo" />
                <p className="text-sm text-black text-center min-w-24">{game.homeTeam.city}</p>
              </div>
              <div className="flex flex-col mt-3">
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1">{getFormattedTime(game.time)}</div>
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1">{game.date.slice(0,-6)}</div>
              </div>
            </div>
          </div> : <div className="w-full h-6 bg-white"></div>
        }
        {role != 'dashboard' ?
          <div className={`flex flex-col items-center justify-center border-2 rounded-md p-1 -mt-2 cursor-pointer relative min-h-12 flex-none w-36 shadow-md ${role === 'Referee' ? 'border-orange-500' : role === 'Linesman' ? 'border-black' : ''}`}>
            <div>{label}</div>
          </div> : <div className="mb-14 bg-white"></div>
        }
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
          const blockedOffDatesAlready = gatherOfficialCalendarDataById(official.uid);
          return (
            <div
              key={`official-${official.uid}`}
              onMouseOver={() => setOfficialHovered(official.uid)}
              onClick={(e) => handleClick(e, official.uid)}
              className={`cursor-pointer hover:bg-gray-100 flex flex-col items-start p-2 ${index < sortedData.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="flex flex-row justify-between items-start gap-2 w-full">
                <div className="flex flex-row items-center">
                  <img className="w-10 h-10 rounded-full mr-4" src={official.profilePictureUrl} alt="official" />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-600">
                      {official.firstName} {official.lastName}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">
                      {official.city}
                    </p>
                  </div>

                  {assignedGamesAlready && assignedGamesAlready.length > 0 && (
                    <div className="flex-1">
                      <p className={`ml-4 text-sm font-normal  ${assignedGamesAlready && assignedGamesAlready.length > 0 ? 'text-error-500' : 'text-gray-900'}`}>
                        {assignedGamesAlready && assignedGamesAlready.length > 0 ? <strong>@ {assignedGamesAlready[0].home_team.abbreviation}</strong> : ''}
                      </p>
                    </div>
                  )}

                  {blockedOffDatesAlready && blockedOffDatesAlready.length > 0 && (
                  <div className="flex flex-col ml-6 -mb-6 -mt-2">
                    {blockedOffDatesAlready.map((times, index) => (
                      <React.Fragment key={index}>
                        <div className="flex items-center">
                          {times.startTime === '00:00' && times.endTime === '23:59' ? (
                            <p className="h-6 w-6 text-warning-300 mr-2 mt-1">❌</p>
                          ) : (
                            <ExclamationTriangleIcon className="h-6 w-6 text-warning-300 mr-2 mt-1" />
                          )}
                          <div>
                            <p className="mt-2 text-sm font-medium text-black">
                              {times.startTime === '00:00' && times.endTime === '23:59' ? (
                                <span className="text-gray-700">Not Available</span>
                              ) : (
                                <span className="text-gray-700">{format24HourTime(times.startTime)} - {format24HourTime(times.endTime)}</span>
                              )}
                              <br />
                              <span className="text-gray-700">Notes: {times.notes}</span>
                            </p>
                          </div>
                        </div>
                        <br />
                      </React.Fragment>
                    ))}
                  </div>                  
                )}
                </div>

                <div className="flex flex-row items-center gap-2">
                  {/* Display assigned games count */}
                  <p className="text-sm border border-success-500 rounded-md px-2 py-1">
                    {official.assignedCount ? official.assignedCount.toString() : '0'}
                  </p>

                  {/* Display queued games count */}
                  <p className="text-sm border border-warning-300 rounded-md px-2 py-1">
                  {official.queueCount ? official.queueCount.toString() : '0'}
                  </p>

                  {isOfficialHovered(official.uid) && date != '2021-10-10' && (
                    <Button className="self-start" onClick={(e) => handleAssignClick(e, official.uid)}>{isAssigned ? 'Replace Official' : 'Assign + '}</Button>
                  )}
                </div>
              </div>

              {officialClicked === official.uid && officialsData && (
                <div className="mt-4 flex flex-col">
                  {assignedGames && (
                    <div className="flex flex-row flex-1 gap-4 justify-between">
                      <div className="h-auto min-w-[300px]">
                        <p className="text-xs mt-4 font-bold">Assigned Games</p>
                        <table className="mt-2 max-h-[300px] h-auto overflow-y-auto min-w-[300px]">
                          <thead>
                            <tr className="text-xs font-medium text-black">
                              <td>Date</td>
                              <td>Game</td>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedGames && Object.keys(assignedGames).map((dateKey) => (
                              <>
                                {assignedGames[dateKey].map((game) => (
                                  <tr key={`games-${dateKey}`} className="text-xs font-body text-gray-700">
                                    <td>{dateKey}</td>
                                    <td>{game.visiting_team.abbreviation} @ {game.home_team.abbreviation}</td>
                                  </tr>
                                ))}
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="h-auto min-w-[300px]">
                        <p className="text-xs mt-4 font-bold">Queued Games</p>
                        <table className="mt-2 max-h-[300px] h-auto overflow-y-auto min-w-[300px]">
                          <thead>
                            <tr className="text-xs font-medium text-black">
                              <td>Date</td>
                              <td>Game</td>
                            </tr>
                          </thead>
                          <tbody>
                            {queuedGames && Object.keys(queuedGames).map((dateKey) => (
                              <>
                                {queuedGames[dateKey].map((game) => (
                                  <tr key={`games-${dateKey}`} className="text-xs font-body text-gray-700">
                                    <td>{dateKey}</td>
                                    <td>{game.visiting_team.abbreviation} @ {game.home_team.abbreviation}</td>
                                  </tr>
                                ))}
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
