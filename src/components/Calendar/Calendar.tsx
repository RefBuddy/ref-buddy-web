import React, { FC } from 'react';
import { Calendar, momentLocalizer, Event, Navigate } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface MyEvent extends Event {
  title: string;
}

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
  
  const CustomToolbar: FC<CustomToolbarProps> = ({ onNavigate, label }) => (
    <div className="rbc-toolbar" style={toolbarStyle}>
      <span className="rbc-btn-group">
        <button style={buttonStyle} type="button" onClick={() => onNavigate(Navigate.PREVIOUS)}>
          {"<"}
        </button>
        <span className="rbc-toolbar-label">{label}</span>
        <button style={buttonStyle} type="button" onClick={() => onNavigate(Navigate.NEXT)}>
          {">"}
        </button>
      </span>
    </div>
  );  
  
const MyCalendar: FC = () => (
  <div>
    <Calendar
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={[] as MyEvent[]}
      style={{ height: "100vh" }}
      selectable
      views={["month"]}
      components={{
        toolbar: CustomToolbar,
      }}
    />
  </div>
);

export default MyCalendar;
