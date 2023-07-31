import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store';
import { addToQueue } from '../../store/Games/actions';
import { formatDate } from "../../utils/helpers";
import { getUserCalendarEvents, getAllOfficialsCalendarEvents, getOfficialsStats } from "../../store/User/actions";
import { Button } from "../Button";
import { format24HourTime } from '../../utils/helpers';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const OfficialsList = ({ game, role, setShowOfficialsList }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const [officialClicked, setOfficialClicked] = useState('');
  const [officialsData, setOfficialsData] = useState<OfficialData | null>(null);
  const { officialsCalendarData, assignedGames, officialsStats } = useAppSelector(state => state.user);
  const league = useAppSelector(state => state.games.currentLeague);
  const season = useAppSelector(state => state.games.currentSeason);
  const date = game.time.slice(0, 10);
  const gameNumber = game.gameNumber;
  
  const officials = role === 'supervisor' ? useAppSelector(state => state.officials.supervisorsList) : useAppSelector(state => state.officials.officialsList);

  // this hook converts the officials object to an array and sorts it when the component mounts
  useEffect(() => {
    const officialsArray = Object.keys(officials).map(key => officials[key]);
    const sortedOfficials = officialsArray.sort((a, b) => a.lastName.localeCompare(b.lastName));
    setSortedData(sortedOfficials);
  }, []);

  useEffect(() => {
    dispatch(getAllOfficialsCalendarEvents({ gameDate: date }));
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

  const handleAssignClick = async (uid: string) => {
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

    // Close the OfficialsList after official is clicked
    setShowOfficialsList(false);

    // Show toast message
    toast.success(`${officials[uid].firstName} ${officials[uid].lastName} added to queue.`);
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

  const handleClick = (uid: string) => {
    if (isOfficialHovered(uid)) {
      const filteredOfficialProfileInfoKey = Object.keys(officials).filter((key) => key === uid)
      if (filteredOfficialProfileInfoKey.length > 0) {
        const filterOfficialProfile = officials[filteredOfficialProfileInfoKey[0]]
        setOfficialsData(filterOfficialProfile);
        setOfficialClicked(uid);
        dispatch(getUserCalendarEvents({ uid: uid }));
        const statProps = {
          league: 'bchl',
          season: '2022-2023',
          name: `${filterOfficialProfile.firstName} ${filterOfficialProfile.lastName}`
        }
        dispatch(getOfficialsStats(statProps));
      }
      
    }
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-md max-h-96 overflow-y-auto mt-12">
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
            onClick={() => handleClick(official.uid)}
            className={`cursor-pointer hover:bg-gray-100 flex flex-col items-start p-2 ${index < sortedData.length - 1 ? 'border-b border-gray-200' : ''}`}
          >
            <div className="flex flex-row justify-between items-center gap-2 w-full">
              <div className="flex flex-row items-start">
                <div className="flex flex-row items-center justify-start">
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
              </div>
              {isOfficialHovered(official.uid) && (
                <Button className="self-start" onClick={() => handleAssignClick(official.uid)}>Assign + </Button>
              )}
            </div>
            {officialClicked === official.uid && officialsData && (
              <div className="mt-4 flex flex-col">
                {/* <div className="flex flex-row gap-4">
                  <div className="flex flex-col">
                    <p className="text-gray-700 text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-700">{officialsData.address}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-700 text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-700">{officialsData.phoneNumber}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-700 text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-700">{officialsData.email}</p>
                  </div>
                </div> */}
                {assignedGames && (
                  <div className="flex flex-row flex-1 gap-4 justify-between">
                    <div className="h-auto min-w-[300px]">
                      <p className="text-xs mt-4 font-bold">Assigned Games</p>
                      <table className="mt-2 max-h-[300px] h-auto overflow-y-auto min-w-[300px]">
                        <thead>
                          <tr className="text-xs font-medium text-black">
                            <td>Date</td>
                            <td>Home/Away</td>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedGames && Object.keys(assignedGames).map((dateKey) => (
                            <>
                              {assignedGames[dateKey].map((game) => (
                                <tr key={`games-${dateKey}`} className="text-xs font-body text-gray-700">
                                  <td>{dateKey}</td>
                                  <td>{game.home_team.abbreviation} / {game.visiting_team.abbreviation}</td>
                                </tr>
                              ))}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* {officialsStats && role != 'supervisor' && (
                      <div className="h-auto min-w-1/2">
                        <p className="text-xs mt-4 font-bold">Stats (From Last Season)</p>
                        <div className="flex flex-row gap-x-8 gap-y-2 flex-wrap mt-2">
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Games</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? officialsStats.refereeStats.games : officialsStats.linesmanStats?.games}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Goals / game</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? officialsStats.refereeStats.average_goals.toFixed(2) : officialsStats.linesmanStats?.average_goals.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">PP / game</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? officialsStats.refereeStats.average_power_plays.toFixed(2) : officialsStats.linesmanStats?.average_power_plays.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Infractions / game</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? officialsStats.refereeStats.average_infractions.toFixed(2) : officialsStats.linesmanStats?.average_infractions.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Penalty minutes / game</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? officialsStats.refereeStats.average_penalty_minutes.toFixed(2) : officialsStats.linesmanStats?.average_penalty_minutes.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Home penalty %</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? ((officialsStats.refereeStats.total_home_infractions / (officialsStats.refereeStats.total_home_infractions + officialsStats.refereeStats.total_visiting_infractions)) * 100).toFixed(2) : ((officialsStats.linesmanStats!.total_home_infractions / (officialsStats.linesmanStats!.total_home_infractions + officialsStats.linesmanStats!.total_visiting_infractions)) * 100).toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col w-[40%]">
                            <p className="text-black text-xs font-medium">Home win %</p>
                            <p className="text-xs text-gray-700">{officialsStats.refereeStats ? ((officialsStats.refereeStats.total_home_wins / (officialsStats.refereeStats.total_home_wins + officialsStats.refereeStats.total_visiting_wins)) * 100).toFixed(2) : ((officialsStats.linesmanStats!.total_home_wins / (officialsStats.linesmanStats!.total_home_wins + officialsStats.linesmanStats!.total_visiting_wins)) * 100).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )} */}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );  
};

export default OfficialsList;
