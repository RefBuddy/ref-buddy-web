import React, { FC } from 'react';
import {
  Navigate,
} from 'react-big-calendar';
import {
  addMonths,
  subMonths,
} from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setCurrentDate } from '../../../store/Games/reducer';
import { formatDate } from '../../../utils/helpers';

interface CustomToolbarProps {
  onNavigate: (action: Navigate.ACTION) => void;
  label: string;
}

const toolbarStyle = {
    display: 'flex',
    justifyContent: 'center',
  };
  
  const buttonStyle = {
    margin: '10px 30px 0',
  };

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
    <div className="rbc-toolbar" style={toolbarStyle}>
      <span className="rbc-btn-group">
        <button style={buttonStyle} type="button" onClick={() => handleNavigate(Navigate.PREVIOUS)}>
          {"<"}
        </button>
        <span className="rbc-toolbar-label">{label}</span>
        <button style={buttonStyle} type="button" onClick={() => handleNavigate(Navigate.NEXT)}>
          {">"}
        </button>
      </span>
    </div>
  );
};

export default CustomToolbar;