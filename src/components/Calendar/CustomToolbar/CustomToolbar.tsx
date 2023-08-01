import React, { FC } from 'react';
import { Navigate } from 'react-big-calendar';
import { addMonths, subMonths, parseISO } from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCurrentDate } from '../../../store/Games/reducer';
import { releaseGame } from '../../../store/Assigning/actions';
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

  // const handleReleaseGame = () => {
  //   const newGame = {
  //     uids: ['gUJf0bsrLxaXfrzqSsoeZVki3m13', 'pPtrMKCdPeeCOxXp363HSkuMolz1', 'yJATy5ryMchCgBUU6IQvT0pZtY52', 'uRpsolPDKhfK8oG2w0156wv5yap1'],
  //     date: '2023-09-08',
  //     gameNumber: '30',
  //     league: 'bchl',
  //     season: '2023-2024',
  //   };
  //   dispatch(releaseGame(newGame));
  // };

  return (
    <div className="rbc-toolbar flex justify-center items-center pt-4">
      <button type="button" onClick={() => handleNavigate(Navigate.PREVIOUS)}>
        <ChevronLeftIcon className="h-6 w-6"/>
      </button>
      <span className="rbc-toolbar-label text-center font-bold">{label}</span>
      <button type="button" onClick={() => handleNavigate(Navigate.NEXT)}>
        <ChevronRightIcon className="h-6 w-6"/>
      </button>
      {/* <button type="button" onClick={handleReleaseGame}>
        <PlusIcon className="h-6 w-6 ml-4"/>
      </button> */}
    </div>
  );
};

export default CustomToolbar;