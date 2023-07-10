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
import { getAllOfficialsCalendarEvents } from '../../store/User/actions';
import { resetCalendarEventsFetch } from '../../store/Games/reducer';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const loading = useAppSelector(state => state.games.loading || state.user.loading || state.officials.loading);
  const { refetchCalendarEvents } = useAppSelector(state => state.games);
  const dispatch = useAppDispatch();

  // store list of officials in redux
  useEffect(() => {
    // const uids = [
    //   'gUJf0bsrLxaXfrzqSsoeZVki3m13',
    //   '9f9qDSbt3Vd24hO4JdMIW5b8Oh93',
    //   'pPtrMKCdPeeCOxXp363HSkuMolz1',
    //   'uRpsolPDKhfK8oG2w0156wv5yap1',
    // ];

    dispatch(getOfficialsList({ league: 'bchl' }));
    // dispatch(getUserCalendarEvents({ uid: 'gUJf0bsrLxaXfrzqSsoeZVki3m13' }));
    // dispatch(getUserCalendarEvents({ uid: '9f9qDSbt3Vd24hO4JdMIW5b8Oh93' }));
    // dispatch(getUserCalendarEvents({ uid: 'pPtrMKCdPeeCOxXp363HSkuMolz1' }));
    // dispatch(getUserCalendarEvents({ uid: 'uRpsolPDKhfK8oG2w0156wv5yap1' }));
    dispatch(getAllOfficialsCalendarEvents());
  }, []);

  useEffect(() => {
    if (refetchCalendarEvents) {
      dispatch(getAllOfficialsCalendarEvents());
      dispatch(resetCalendarEventsFetch())
    }
  }, [refetchCalendarEvents])
  // OverviewTravel component data
  const chartSeries = [3, 6];
  const labels = ['Hotel', 'Home'];

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {loading ? <Loading /> : <></>}
        <div className="flex items-center p-5">
          <OverviewExpenses value="$10,000" positive={true} difference={10} />
          <OverviewGameReports progress={44} value="4 / 9" />
          <AssigningStatus />
        </div>
        <div className="flex items-center p-5 justify-between">
          <div className="flex-1">
            <MyCalendar />
          </div>
          <OverviewTravel chartSeries={chartSeries} labels={labels} />
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
