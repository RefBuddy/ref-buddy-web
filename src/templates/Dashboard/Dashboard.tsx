import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import { Loading } from '../../components/Loading';
import OverviewOfficials from '../../components/OverviewOfficials/OverviewOfficials';
import OverviewAddGame from '../../components/OverviewAddGame/OverviewAddGame';
import OverviewLogout from '../../components/OverviewLogout/OverviewLogout';
import { getOfficialsList } from '../../store/OfficialsList/actions';
import { resetCalendarEventsFetch } from '../../store/Games/reducer';
import QueuedTable from '../../components/Table/QueuedTable';

const Dashboard: React.FC<any> = () => {
  const loading = useAppSelector(
    (state) =>
      state.games.loading || state.user.loading || state.officials.loading,
  );
  const { refetchCalendarEvents } = useAppSelector((state) => state.games);
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.user.currentLeague);

  // store list of officials in redux
  useEffect(() => {
    dispatch(getOfficialsList({ league: league }));
  }, []);

  useEffect(() => {
    if (refetchCalendarEvents) {
      dispatch(resetCalendarEventsFetch());
    }
  }, [refetchCalendarEvents]);

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main className="flex flex-col items-center flex-1">
        {loading ? <Loading /> : null}

        {/* Overviews Row */}
        <div className="flex justify-start items-start w-full p-5 pb-0">
          <OverviewAddGame />
          <OverviewOfficials />
          {/* <OverviewLogout /> */}
        </div>

        {/* Calendar and Table Row */}
        <div className="flex flex-col lg:flex-row justify-center items-start w-full xl:gap-2 gap-4 p-5">
          <div className="xl:w-3/5 w-full mb-4 lg:mb-0">
            {' '}
            {/* Add margin-bottom for smaller screens */}
            {league ? <MyCalendar /> : null}
          </div>
          <div className="xl:w-2/5 w-auto ml-0 lg:ml-4">
            {' '}
            {/* Remove left margin for smaller screens */}
            {!loading ? <QueuedTable /> : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
