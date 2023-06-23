import React from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import Modal from '../../components/Modal/Modal';
import { useAppSelector } from '../../store';
import { EventModal } from '../../components/Calendar/EventModal';
import { SelectedGames } from '../../components/Calendar/SelectedGames';
import { Loading } from '../../components/Loading';
import { OverviewBudget } from '../../components/OverviewBudget';
import { OverviewGameReports } from '../../components/OverviewGameReports';
import { OverviewTravel } from '../../components/OverviewTravel';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);
  const selectedGames = useAppSelector(state => state.games.selectedGames);
  const loading = useAppSelector(state => state.games.loading);

  // Here's an example of data that you might pass to the OverviewTravel component.
  // You'll want to replace this with actual data.
  const chartSeries = [3, 6];
  const labels = ['Hotel', 'Home'];

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {loading ? <Loading /> : <></>}
        <div className="flex items-center p-5">
          <OverviewBudget value="$10,000" positive={true} difference={10} />
          <OverviewGameReports progress={44} value="4 / 9" />
        </div>
        <div className="flex items-center p-5 justify-between">
          <div className="flex-1">
            {selectedGames && selectedGames.length === 0 && <MyCalendar />}
          </div>
          <OverviewTravel chartSeries={chartSeries} labels={labels} />
        </div>
        {selectedGames && selectedGames.length > 0 ? <SelectedGames /> : <></>}
        {openModal && modalType === 'event' && selectedEvent && (
          createPortal(
            <Modal>
              <EventModal />
            </Modal>,
            document.body
          )
        )}
      </main>
    </div>
  );
}

export default Dashboard;
