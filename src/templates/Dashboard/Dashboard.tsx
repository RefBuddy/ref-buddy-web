import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import { Loading } from '../../components/Loading';
import OverviewOfficials from '../../components/OverviewOfficials/OverviewOfficials';
import OverviewGameReports from '../../components/OverviewGameReports/OverviewGameReports';
import OverviewTravel from '../../components/OverviewTravel/OverviewTravel';
import { getOfficialsList } from '../../store/OfficialsList/actions';
import { resetCalendarEventsFetch } from '../../store/Games/reducer';
import QueuedTable from '../../components/Table/QueuedTable';

const Dashboard: React.FC<any> = () => {
  const loading = useAppSelector(state => state.games.loading || state.user.loading || state.officials.loading);
  const { refetchCalendarEvents } = useAppSelector(state => state.games);
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.games.currentLeague);

  // store list of officials in redux
  useEffect(() => {
    dispatch(getOfficialsList({ league: league }));
  }, []);

  useEffect(() => {
    if (refetchCalendarEvents) {
      dispatch(resetCalendarEventsFetch())
    }
  }, [refetchCalendarEvents])

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {loading ? <Loading /> : <></>}
        <div className="flex items-center p-5">
          <OverviewGameReports progress={44} value="4 / 9" />
          <OverviewOfficials />
        </div>
        <div className="flex flex-1 xl:flex-row flex-col items-start xl:gap-2 gap-4 p-5 mr-4">
          <div className="xl:w-3/5 w-full">
            <MyCalendar />
          </div>
          <div className="xl:w-2/5 w-auto ml-4">
            {!loading ? (
              <QueuedTable />
            ) : <></>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
