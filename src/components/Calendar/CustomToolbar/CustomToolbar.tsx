import React, { FC } from 'react';
import { Navigate } from 'react-big-calendar';
import { addMonths, subMonths, parseISO } from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCurrentDate } from '../../../store/Games/reducer';
import { addGame } from '../../../store/Games/actions';
import { formatDate } from '../../../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/24/solid';

interface CustomToolbarProps {
  onNavigate: (action: Navigate.ACTION) => void;
  label: string;
}

const CustomToolbar: FC<CustomToolbarProps> = ({ onNavigate, label }) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(state => state.games.currentDate);

  const handleNavigate = (action: Navigate.ACTION) => {
    if (action === Navigate.PREVIOUS) {
      let currentDateObj = parseISO(currentDate);
      const previousMonth = subMonths(currentDateObj, 1);
      const dateString = formatDate(previousMonth);
      dispatch(setCurrentDate(dateString));
    } else if (action === Navigate.NEXT) {
      let currentDateObj = parseISO(currentDate);
      const nextMonth = addMonths(currentDateObj, 1);
      const dateString = formatDate(nextMonth);
      dispatch(setCurrentDate(dateString));
    }   

    onNavigate(action);
  };

  const handleAddGame = () => {
    const newGame = {
      league: 'bchl',
      season: '2023-2024',
      homeTeam: 'Salmon Arm',
      visitingTeam: 'Penticton',
      dateISO8601: '2023-09-27T19:00:00-07:00',
    };
    dispatch(addGame(newGame));
  };

  return (
    <div className="rbc-toolbar flex justify-center items-center pt-4">
      <button type="button" onClick={() => handleNavigate(Navigate.PREVIOUS)}>
        <ChevronLeftIcon className="h-6 w-6"/>
      </button>
      <span className="rbc-toolbar-label text-center font-bold">{label}</span>
      <button type="button" onClick={() => handleNavigate(Navigate.NEXT)}>
        <ChevronRightIcon className="h-6 w-6"/>
      </button>
      <button type="button" onClick={handleAddGame}>
        <PlusIcon className="h-6 w-6 ml-4"/>
      </button>
    </div>
  );
};

export default CustomToolbar;