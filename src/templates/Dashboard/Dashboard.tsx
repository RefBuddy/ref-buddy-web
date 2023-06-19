import React from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import Modal from '../../components/Modal/Modal';
import { useAppSelector } from '../../store';
import { EventModal } from '../../components/Calendar/EventModal';
import { SelectedGames } from '../../components/Calendar/SelectedGames';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);
  const selectedGames = useAppSelector(state => state.games.selectedGames);

  return (
    <main>
      <Navbar />
      {selectedGames && selectedGames.length === 0 ? <MyCalendar /> : <></>}
      {selectedGames && selectedGames.length > 1 ? <SelectedGames /> : <></>}
      {openModal && modalType === 'event' && selectedEvent && (
        createPortal(
          <Modal>
            <EventModal />
          </Modal>,
          document.body
        )
      )}
    </main>
  );
}

export default Dashboard;