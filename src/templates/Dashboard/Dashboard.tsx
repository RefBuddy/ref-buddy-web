import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import Modal from '../../components/Modal/Modal';
import { useAppSelector } from '../../store';
import { SelectedGames } from '../../components/Calendar/SelectedGames';
import { Loading } from '../../components/Loading';
import { OverviewExpenses } from '../../components/OverviewExpenses';
import { OverviewGameReports } from '../../components/OverviewGameReports';
import { OverviewTravel } from '../../components/OverviewTravel';
import { AssigningStatus } from '../../components/AssigningStatus';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);
  const selectedGames = useAppSelector(state => state.games.selectedGames);
  const loading = useAppSelector(state => state.games.loading);
  const [isGamesModalOpen, setIsGamesModalOpen] = useState(false);

  useEffect(() => {
    if (selectedGames && selectedGames.length > 0 && openModal && modalType === 'games') {
      setIsGamesModalOpen(true);
    } else {
      setIsGamesModalOpen(false);
    }
  }, [selectedGames, openModal, modalType]);

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
        {(openModal && modalType === 'games') || (openModal && modalType === 'event' && selectedEvent) ? (
          createPortal(
            <Modal onClose={() => setIsGamesModalOpen(false)}>
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
