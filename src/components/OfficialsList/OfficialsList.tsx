import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import { useAppSelector, useAppDispatch } from '../../store';
import { assignToGame } from '../../store/Games/actions';
import { formatDate } from "../../utils/helpers";
import { getAllOfficialsCalendarEvents } from "../../store/User/actions";
import { Button } from "../Button";
import { format24HourTime } from '../../utils/helpers';

const OfficialsList = ({ game, role, setShowOfficialsList }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const { officialsCalendarData } = useAppSelector(state => state.user);
  const officials = useAppSelector(state => state.officials.officialsList);
  const league = useAppSelector(state => state.games.currentLeague);
  const season = useAppSelector(state => state.games.currentSeason);
  const date = game.time.slice(0, 10);
  const gameNumber = game.gameNumber;

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

  const handleOfficialClick = async (uid: string) => {
    const gameData = {
      uid: uid,
      role: role,
      date: date,
      gameNumber: gameNumber,
      league: league,
      season: season,
    };

    // Dispatch the assignToGame action and await for it to finish
    await dispatch(assignToGame(gameData));

    // Close the OfficialsList after official is clicked
    setShowOfficialsList(false);
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

    const assignedGames = officialsCalendarData[uid].assignedGames;
    const currentSelectedDate = parseISO(game.time);
    const formattedTime = formatDate(currentSelectedDate);

    try {
      return assignedGames[formattedTime];
    } catch (error) {
      return null;
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
        const isOfficialHovered = officialHovered === official.uid;
        const assignedGamesAlready = assignedGamesOfOfficial(official.uid);
        const blockedOffDatesAlready = gatherOfficialCalendarDataById(official.uid);

        return (
          <div
            key={official.uid}
            onMouseOver={() => setOfficialHovered(official.uid)}
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
                    <div className="flex-4 ml-8 -mt-2">
                      <p className={`mt-2 text-sm font-normal text-black`}>
                        <strong>BLOCKED OFF TIMES</strong>
                        <br />
                        {blockedOffDatesAlready.map((times, index) => (
                          <React.Fragment key={index}>
                            <span className="mt-2">{format24HourTime(times.startTime)} - {format24HourTime(times.endTime)}</span>
                            <br />
                            <span className="mt-2">Notes: {times.notes}</span>
                            <br />
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {isOfficialHovered && (
                <Button className="self-start" onClick={() => handleOfficialClick(official.uid)}>Assign + </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OfficialsList;
