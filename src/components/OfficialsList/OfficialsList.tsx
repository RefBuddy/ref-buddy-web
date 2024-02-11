import React, { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store';
import { getOfficialsList } from '../../store/OfficialsList/actions';
import { formatDate, format24HourTime } from '../../utils/helpers';
import {
  getUserCalendarEvents,
  getAllOfficialsCalendarEvents,
  getOfficialsStats,
  updateOfficialRole,
} from '../../store/User/actions';
import { Button } from '../Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import * as Utils from './utils';

const OfficialsList = ({ game, role, isAssigned, close = () => {} }) => {
  const dispatch = useAppDispatch();

  // State initialization
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const [officialClicked, setOfficialClicked] = useState('');
  const [officialsData, setOfficialsData] = useState<OfficialData>();
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Extract necessary data from global state
  const {
    officialsCalendarData,
    assignedGames,
    queuedGames,
    blockedOffTimes,
    officialsStats,
    currentLeague,
    currentSeason,
  } = useAppSelector((state) => state.user);
  const date = game.time.slice(0, 10);
  const gameNumber = game.gameNumber;
  const currentDate = useAppSelector((state) => state.games.currentDate);
  const label = Utils.getLabel(isAssigned, role);
  const roleDetails = Utils.getRoleDetails(role);
  const officialsOrSupervisors = Utils.getOfficialsOrSupervisors(role);

  const [showReferees, setShowReferees] = useState(
    roleDetails === 'Referee' || role === 'dashboard',
  );
  const [showLinesmen, setShowLinesmen] = useState(
    roleDetails === 'Linesman' || role === 'dashboard',
  );

  // Sort and filter officials based on role
  useEffect(() => {
    const officialsArray = Utils.getOfficialsArray(officialsOrSupervisors);
    const filteredOfficialsForRole = Utils.getListOfSpecificRole(officialsArray, showReferees, showLinesmen, role);
    const sortedOfficials = Utils.sortOfficials(filteredOfficialsForRole);
    setSortedData(sortedOfficials);
  }, [officialsOrSupervisors, showReferees, showLinesmen]);

  // This shows the calendar events beside the official's name
  // We don't need this if we are just showing the list of officials and not assigning a game
  useEffect(() => {
    Utils.fetchOfficialsCalendarEvents(role, date, currentLeague, dispatch);
  }, [role, date, currentLeague, dispatch]);

  // Handle input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const sortedOfficials = Utils.filterAndSortOfficials(officialsOrSupervisors, showReferees, showLinesmen, searchTerm);
    setSortedData(sortedOfficials);
  };

  const handleRefereeCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowReferees(e.target.checked);
  };

  const handleLinesmanCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowLinesmen(e.target.checked);
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
    // Check if the target of the click event is the checkbox
    if (e.target.type === 'checkbox') {
      return;
    }

    e.stopPropagation();

    // Check if the clicked official is already being displayed
    if (officialClicked === uid) {
      // Clear the data
      setOfficialsData(undefined);
      setOfficialClicked('');
      setShowSaveButton(false);
      return;
    }

    if (isOfficialHovered(uid)) {
      const filteredOfficialProfileInfoKey = Object.keys(officialsOrSupervisors).filter(
        (key) => key === uid,
      );
      if (filteredOfficialProfileInfoKey.length > 0) {
        const filterOfficialProfile =
          officialsOrSupervisors[filteredOfficialProfileInfoKey[0]];
        setOfficialsData(filterOfficialProfile);
        setOfficialClicked(uid);
        dispatch(getUserCalendarEvents({ uid: uid }));
        setShowSaveButton(false);
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

  const extractMonthYear = (dateStr) => {
    if (dateStr === '2021-10-10') {
      dateStr = currentDate;
    }
    const dateObj = new Date(dateStr);
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
  };

  const originalRefereeState = false;
  const originalLinesmanState = false;

  const handlePreferredSideChange = (e, role) => {
    if (!officialsData) return;
    // Directly updating the officialsData's role
    const updatedRole = { ...officialsData?.role, [role]: e.target.checked };
    const updatedOfficialsData = { ...officialsData, role: updatedRole };

    setOfficialsData(updatedOfficialsData);

    // Check if the state differs from the original state for either checkbox
    if (
      (role === 'Referee' && e.target.checked !== originalRefereeState) ||
      (role === 'Linesman' && e.target.checked !== originalLinesmanState)
    ) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(
        updatedOfficialsData.role.Referee !== originalRefereeState ||
          updatedOfficialsData.role.Linesman !== originalLinesmanState,
      );
    }
  };

  const updateUserRole = async (uid) => {
    if (!officialsData) return;

    const filteredOfficialProfileInfoKey = Object.keys(officialsOrSupervisors).filter(
      (key) => key === uid,
    );

    if (filteredOfficialProfileInfoKey.length > 0) {
      const updatedOfficialProfile = {
        ...officialsOrSupervisors[filteredOfficialProfileInfoKey[0]],
      };

      // Ensure that the official's role is updated in the fetched data before dispatching the update action
      updatedOfficialProfile.role = {
        ...updatedOfficialProfile.role,
        Linesman: officialsData.role.Linesman,
        Referee: officialsData.role.Referee,
      };

      await handleRoleChange(uid, updatedOfficialProfile.role);

      setOfficialsData(updatedOfficialProfile);

      dispatch(getOfficialsList({ league: currentLeague }));

      toast.success('Role updated successfully');
    } else {
      toast.error('Error updating role');
    }
  };

  async function handleRoleChange(uid: string, role: any) {
    try {
      await dispatch(
        updateOfficialRole({
          uid: uid,
          role: role,
          league: currentLeague,
        }),
      );
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  return (
    <>
      {/* teams, game time, checkboxes */}
      <div className="flex items-center justify-between w-full -mt-6 -mb-3">
        {role != 'dashboard' ? (
          <div className="flex w-full items-center justify-start p-4">
            <div className="flex flex-row items-center gap-2 ml-6">
              {currentLeague == 'bchl' ? (
                <>
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
                </>
              ) : (
                <div className="w-full h-6 bg-white"></div>
              )}
              <div className="flex flex-col -mb-2">
                <div className="text-xs font-semibold text-gray-700 mb-2 -mt-1 w-40">
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
        {/* Adding the R and L checkboxes here */}
        <div className="flex flex-row gap-3 mr-16">
          <div className="flex flex-row gap-1 items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              checked={showReferees}
              onChange={handleRefereeCheckboxChange}
            />
            <label className="text-xs font-medium text-black">R</label>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              checked={showLinesmen}
              onChange={handleLinesmanCheckboxChange}
            />
            <label className="text-xs font-medium text-black">L</label>
          </div>
        </div>
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
          const datesAlreadyblockedOff = Utils.getOfficialCalendarData(official.uid, officialsCalendarData, game);
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
                  {datesAlreadyblockedOff &&
                    datesAlreadyblockedOff.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {' '}
                        {/* Use flex-column for vertical alignment */}
                        {datesAlreadyblockedOff.map((times, index) => (
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
                    <Button onClick={async (e) => {
                      await Utils.handleAssignClick(e, official.uid, isAssigned, date, gameNumber, role, dispatch, currentLeague, currentSeason);
                      Utils.toastFeedback(official.uid, isAssigned, officialsOrSupervisors);
                      close();
                    }}>
                      {isAssigned && role != 'supervisor'
                        ? 'Replace Official'
                        : 'Assign + '}
                    </Button>
                  )}
                </div>
              </div>

              {officialClicked === official.uid && officialsData && (
                <div className="mt-4 flex flex-col">
                  {assignedGames && (
                    <div className="flex flex-row flex-1 justify-between items-start">
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
                              Object.keys(blockedOffTimes)
                                .filter(
                                  (dateKey) =>
                                    extractMonthYear(dateKey) ===
                                    extractMonthYear(date),
                                )
                                .map((dateKey) => (
                                  <>
                                    {blockedOffTimes[dateKey].map(
                                      (block, index) => (
                                        <tr
                                          key={`block-${dateKey}-${index}`}
                                          className="text-xs font-body text-gray-700"
                                        >
                                          <td>{dateKey}</td>
                                          <td>
                                            {block.startTime === '00:00' &&
                                            block.endTime === '23:59' ? (
                                              <p className="pl-4">❌</p>
                                            ) : (
                                              <span className="text-gray-700">
                                                {format24HourTime(
                                                  block.startTime,
                                                )}{' '}
                                                -{' '}
                                                {format24HourTime(
                                                  block.endTime,
                                                )}
                                              </span>
                                            )}
                                          </td>
                                          <td className="pl-4">
                                            {block.notes}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                  </>
                                ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="h-auto flex-shrink-0 ml-64 mt-2">
                        <div className="mt-2 flex flex-row gap-3">
                          <div className="flex flex-row gap-1 items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              checked={officialsData?.role?.Referee || false}
                              onChange={(e) =>
                                handlePreferredSideChange(e, 'Referee')
                              }
                            />

                            <label className="text-xs font-medium text-black">
                              R
                            </label>
                          </div>
                          <div className="flex flex-row gap-1 items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              checked={officialsData?.role?.Linesman || false}
                              onChange={(e) =>
                                handlePreferredSideChange(e, 'Linesman')
                              }
                            />

                            <label className="text-xs font-medium text-black">
                              L
                            </label>
                          </div>
                        </div>
                        {showSaveButton && (
                          <Button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md mt-2 ml-1 text-xs"
                            onClick={() => {
                              updateUserRole(official.uid);
                            }}
                          >
                            Save
                          </Button>
                        )}
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
