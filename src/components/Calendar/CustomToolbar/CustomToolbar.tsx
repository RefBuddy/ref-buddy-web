import React, { FC } from 'react';
import { Navigate } from 'react-big-calendar';
import { addMonths, subMonths } from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCurrentDate } from '../../../store/Games/reducer';
import { formatDate } from '../../../utils/helpers';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface CustomToolbarProps {
  onNavigate: (action: Navigate.ACTION) => void;
  label: string;
}

const CustomToolbar: FC<CustomToolbarProps> = ({ onNavigate, label }) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(state => state.games.currentDate);

  const handleNavigate = (action: Navigate.ACTION) => {
    if (action === Navigate.PREVIOUS) {
      const previousMonth = subMonths(new Date(currentDate), 1);
      const dateString = formatDate(previousMonth)
      dispatch(setCurrentDate(dateString));
    } else if (action === Navigate.NEXT) {
      const nextMonth = addMonths(new Date(currentDate), 1);
      const dateString = formatDate(nextMonth)
      dispatch(setCurrentDate(dateString));
    }

    onNavigate(action);
  };

  return (
    <div className="rbc-toolbar flex justify-center items-center pt-4">
      <button type="button" onClick={() => handleNavigate(Navigate.PREVIOUS)}>
        <ChevronLeftIcon className="h-6 w-6"/>
      </button>
      <span className="rbc-toolbar-label text-center mt-1 font-bold">{label}</span>
      <button type="button" onClick={() => handleNavigate(Navigate.NEXT)}>
        <ChevronRightIcon className="h-6 w-6"/>
      </button>
    </div>
  );
};

export default CustomToolbar;
