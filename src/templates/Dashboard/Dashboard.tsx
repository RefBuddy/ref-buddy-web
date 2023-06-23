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

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);
  const selectedGames = useAppSelector(state => state.games.selectedGames);
  const loading = useAppSelector(state => state.games.loading);

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {loading ? <Loading /> : <></>}
        <div className="flex flex-row justify-between items-center p-5">
          <OverviewBudget value="$10,000" positive={true} difference={10} />
        </div>
        {selectedGames && selectedGames.length === 0 ? <MyCalendar /> : <></>}
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