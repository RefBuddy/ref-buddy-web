import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { format24HourTime } from '../../utils/helpers';
import * as Utils from './utils';
import {
  AlreadyAssignedGameTodayCard,
  AssignedGamesCard,
  CheckboxGroup,
  DarkDayCard,
  DarkDaysCard,
  GameCountCard,
  GameDetails,
  OfficialCard,
  QueuedGamesCard,
  ReplaceOrAssignButton,
  RoleCard,
  SearchInput,
  UpdateRoleCheckboxGroup,
} from './components';

const OfficialsList = ({ game, role, isAssigned, close = () => {} }) => {
  const dispatch = useAppDispatch();

  // State initialization
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortedData, setSortedData] = useState<any[]>([]);
  const [officialHovered, setOfficialHovered] = useState('');
  const [officialClicked, setOfficialClicked] = useState('');
  const [officialsData, setOfficialsData] = useState<OfficialData>();

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
                _buildExpandedDetails()
              )}
            </div>
          );

          function _buildExpandedDetails(): React.ReactNode {
            return <div className="mt-4 flex flex-col">
              {assignedGames && (
                <div className="flex flex-row flex-1 justify-between items-start">
                  <AssignedGamesCard assignedGames={assignedGames} />

                  <QueuedGamesCard queuedGames={queuedGames} />

                  <DarkDaysCard blockedOffTimes={blockedOffTimes} date={date} currentDate={currentDate} />

                  <UpdateRoleCheckboxGroup
                    official={official}
                    officialsData={officialsData}
                    setOfficialsData={setOfficialsData}
                    officialsOrSupervisors={officialsOrSupervisors}
                    currentLeague={currentLeague}
                    dispatch={dispatch} />
                </div>
              )}
            </div>;
          }

          function _buildOfficialDetails() {
            return (
              <div className="grid grid-cols-[.65fr,.25fr,.35fr,1fr,1fr] gap-4 w-full items-center">
                <OfficialCard official={official} />

                <div>
                  {assignedGamesAlready?.length > 0 && (
                    <AlreadyAssignedGameTodayCard homeTeamAbbreviation={assignedGamesAlready[0].home_team.abbreviation} />
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
                  {isOfficialHovered(official.uid) && role != 'dashboard' ? (
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
                  ) : (
                    <div></div>
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
