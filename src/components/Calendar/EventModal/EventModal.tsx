import React from 'react';
import { useAppSelector } from '../../../store';

const EventModal = () => {
  const selectedEvent = useAppSelector(state => state.games.selectedEvent);
  return (
    <div className="flex flex-col p-5 justify-center items-center gap-4">
      <h1>Event</h1>
      <div className="flex flex-row gap-4 items-center justify-center">
        <img width={50} height={50} src={selectedEvent?.homeTeam.logo} alt="home team logo" />
        <p>vs.</p>
        <img width={50} height={50} src={selectedEvent?.visitingTeam.logo} alt="visiting team logo" />
      </div>
      
    {/* TODO: add your event details here */}
    </div>
  )
}

export default EventModal;