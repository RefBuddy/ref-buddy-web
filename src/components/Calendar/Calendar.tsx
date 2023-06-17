import React, { FC, useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event, Navigate } from 'react-big-calendar';
import moment from 'moment';
import { httpsCallable } from "firebase/functions";
import { functions, auth } from '../../firebaseOptions';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuthenticationStatus } from '../../components/hooks'; // import the hook

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

const league = 'bchl'; // replace with actual value
const season = '2022-2023'; // replace with actual value

async function getGamesForMonth(date, league, season) {
    const getAdminMonth = httpsCallable(functions, 'getAdminMonth');
  
      const events = await (getAdminMonth({
            date: date.toISOString().substring(0, 10),
            league: league,
            season: season
          }));
      return events.data;
  }

const MyCalendar: FC = () => {
  const [isAuthenticated, loading] = useAuthenticationStatus(); // use the hook

  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Call the function when the component mounts and the user is authenticated
      getGamesForMonth(new Date(), league, season)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [isAuthenticated, loading]);

  return (
    <div>
      {isAuthenticated ? ( // check if the user is authenticated
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
      ) : (
        <p>Please log in to view the calendar</p> // if not authenticated, prompt the user to log in
      )}
    </div>
  );
};

export default MyCalendar;
