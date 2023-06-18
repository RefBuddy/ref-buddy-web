import React, { FC, useEffect } from 'react';
import { Calendar, momentLocalizer, Event, Navigate } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuthenticationStatus } from '../../components/hooks';

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

const CustomToolbar: FC<CustomToolbarProps> = ({ onNavigate, label }) => {
  const handleNavigate = (action: Navigate.ACTION) => {
    onNavigate(action);
    const date = moment(label, 'MMMM YYYY').add(action === Navigate.PREVIOUS ? -1 : 1, 'month').toDate();
    getGamesForMonth(date, league, season)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
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

const league = 'bchl'; 
const season = '2022-2023'; 

async function getGamesForMonth(date, league, season) {
  const url = "https://us-central1-ref-buddy-d7be3.cloudfunctions.net/getAdminMonth"; 
  const data = {
    data: {
      Date: date.toISOString().substring(0, 10),
      league: league,
      season: season
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const events = await response.json();
  return events.data;
}

const MyCalendar: FC = () => {
  const [isAuthenticated, loading] = useAuthenticationStatus();

  useEffect(() => {
    if (isAuthenticated && !loading) {
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
      {isAuthenticated ? (
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
        <p>Please log in to view the calendar</p>
      )}
    </div>
  );
};

export default MyCalendar;