import React from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../../components/Navbar';
import MyCalendar from '../../components/Calendar';
import Modal from '../../components/Modal/Modal';
import { useAppSelector } from '../../store';
import { EventModal } from '../../components/Calendar/EventModal';

const Dashboard: React.FC<any> = () => {
  const openModal = useAppSelector(state => state.modal.modalOpen);
  const modalType = useAppSelector(state => state.modal.modalType);
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);

  return (
    <main>
      <Navbar />
      <MyCalendar />
      {openModal && modalType && selectedEvent && (
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