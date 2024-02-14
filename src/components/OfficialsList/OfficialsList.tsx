import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { format24HourTime } from '../../utils/helpers';
import { Button } from '../Button';
import * as Utils from './utils';
import {
  AssignedGameCard,
  CheckboxGroup,
  DarkDayCard,
  GameCountCard,
  GameDetails,
  OfficialCard,
  ReplaceOrAssignButton,
  RoleCard,
  SearchInput,
} from './components';

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
    const filteredOfficialsForRole = Utils.getListOfSpecificRole(
      officialsArray,
      showReferees,
      showLinesmen,
      role,
    );
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
    const sortedOfficials = Utils.filterAndSortOfficials(
      officialsOrSupervisors,
      showReferees,
      showLinesmen,
      searchTerm,
    );
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

  const isOfficialHovered = (uid) => officialHovered === uid;

  return (
    <>
      {/* Modal header */}
      <div className="flex items-center justify-between w-full -mt-6 -mb-3">
        {role != 'dashboard' ? (
          <GameDetails game={game} currentLeague={currentLeague} />
        ) : (
          <div className="w-full h-6 bg-white"></div>
        )}
        <CheckboxGroup
          showReferees={showReferees}
          handleRefereeCheckboxChange={handleRefereeCheckboxChange}
          showLinesmen={showLinesmen}
          handleLinesmanCheckboxChange={handleLinesmanCheckboxChange}
        />
        {role != 'dashboard' ? (
          <RoleCard roleDetails={roleDetails} label={label} />
        ) : (
          <div className="mb-14 bg-white"></div>
        )}
      </div>

      {/* Main OfficialsList container */}
      <div className="w-full bg-white border border-gray-300 rounded-md max-h-[600px] overflow-y-auto">
        <div className="py-4 px-3">
          <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} />
        </div>
        {sortedData.map((official: any, index) => {
          const assignedGamesAlready = Utils.getOfficialsAssignedGames(
            official.uid,
            officialsCalendarData,
            game,
          );
          const datesAlreadyblockedOff = Utils.getOfficialCalendarData(
            official.uid,
            officialsCalendarData,
            game,
          );
          return (
            <div
              key={`official-${official.uid}`}
              onMouseOver={() => setOfficialHovered(official.uid)}
              onClick={(e) =>
                Utils.expandOrCloseUserInformation(
                  e,
                  official.uid,
                  officialClicked,
                  setOfficialsData,
                  setOfficialClicked,
                  setShowSaveButton,
                  isOfficialHovered,
                  officialsOrSupervisors,
                  dispatch,
                )
              }
              className={`cursor-pointer hover:bg-gray-100 flex flex-col items-start p-2 ${
                index < sortedData.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              {_buildOfficialDetails()}

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
                                    Utils.extractMonthYear(
                                      dateKey,
                                      currentDate,
                                    ) ===
                                    Utils.extractMonthYear(date, currentDate),
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
                                Utils.handleRoleCheckboxChange(
                                  e,
                                  'Referee',
                                  officialsData,
                                  setOfficialsData,
                                  setShowSaveButton,
                                )
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
                                Utils.handleRoleCheckboxChange(
                                  e,
                                  'Linesman',
                                  officialsData,
                                  setOfficialsData,
                                  setShowSaveButton,
                                )
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
                              Utils.updateUserRole(
                                official.uid,
                                officialsData,
                                officialsOrSupervisors,
                                currentLeague,
                                dispatch,
                                setOfficialsData,
                              );
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

          function _buildOfficialDetails() {
            return (
              <div className="grid grid-cols-[.65fr,.25fr,.35fr,1fr,1fr] gap-4 w-full items-center">
                <OfficialCard official={official} />

                <div>
                  {assignedGamesAlready && assignedGamesAlready.length > 0 && (
                    <AssignedGameCard
                      assignedGamesAlready={assignedGamesAlready}
                    />
                  )}
                </div>

                <GameCountCard official={official} />

                <div>
                  {datesAlreadyblockedOff &&
                    datesAlreadyblockedOff.length > 0 && (
                      <DarkDayCard
                        datesAlreadyblockedOff={datesAlreadyblockedOff}
                        format24HourTime={format24HourTime}
                      />
                    )}
                </div>

                <div className="justify-self-end mr-4">
                  {isOfficialHovered(official.uid) && (
                    <ReplaceOrAssignButton
                      official={official}
                      isAssigned={isAssigned}
                      date={date}
                      gameNumber={gameNumber}
                      role={role}
                      dispatch={dispatch}
                      currentLeague={currentLeague}
                      currentSeason={currentSeason}
                      officialsOrSupervisors={officialsOrSupervisors}
                      close={close}
                    />
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
};

export default OfficialsList;
