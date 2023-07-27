import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import Modal from '../../components/Modal/Modal';
import { useAppSelector, useAppDispatch } from '../../store';
import { SelectedGames } from '../../components/Calendar/SelectedGames';
import { Loading } from '../../components/Loading';
import { OverviewExpenses } from '../../components/OverviewExpenses';
import { OverviewGameReports } from '../../components/OverviewGameReports';
import { OverviewTravel } from '../../components/OverviewTravel';
import { AssigningStatus } from '../../components/AssigningStatus';
import { getOfficialsList } from '../../store/OfficialsList/actions';
import { resetCalendarEventsFetch } from '../../store/Games/reducer';
import { QueuedTable } from '../../components/Table';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const loading = useAppSelector(state => state.games.loading || state.user.loading || state.officials.loading);
  const { refetchCalendarEvents } = useAppSelector(state => state.games);
  const dispatch = useAppDispatch();

  // store list of officials in redux
  useEffect(() => {
    dispatch(getOfficialsList({ league: 'bchl' }));
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
          <AssigningStatus />
        </div>
        <div className="flex flex-1 xl:flex-row flex-col items-start xl:gap-2 gap-4 p-5 mr-4">
          <div className="xl:w-3/5 w-full">
            <MyCalendar />
          </div>
          <div className="xl:w-2/5 w-auto ml-4">
            {/* Add table */}
            {!loading ? (
              <QueuedTable />
            ) : <></>}
          </div>
        </div>
        {(openModal && modalType === 'games') ? (
          createPortal(
            <Modal>
              <SelectedGames />
            </Modal>,
            document.body
          )
        ) : null}
      </main>
    </div>
  );
}

export default Dashboard;
