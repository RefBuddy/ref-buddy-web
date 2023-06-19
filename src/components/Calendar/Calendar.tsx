import React, { FC, useEffect } from 'react';
import {
  Calendar,
  Event,
  Navigate,
  dateFnsLocalizer,
} from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuthenticationStatus } from '../../components/hooks';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchGamesByMonth } from '../../store/Games/actions';
import { setCurrentDate, setSelectedEvent } from '../../store/Games/reducer';
import { setModalState } from '../../store/Modal/reducer';


const locales = {
	"en-US": require("date-fns")
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
      const previousMonth = subMonths(currentDate, 1);
      dispatch(setCurrentDate(previousMonth));
    } else if (action === Navigate.NEXT) {
      const nextMonth = addMonths(currentDate, 1);
      dispatch(setCurrentDate(nextMonth));
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

const convertEvents = (events: MonthGameData[]) => {
  const convertedEvents: Event[] = [];
  Object.keys(events).forEach(key => {
    const eventsOnDate = events[key] as GameData[];
    eventsOnDate.forEach(event => {
      const convertedEvent: Event = {
        title: event.homeTeam.abbreviation + " vs " + event.visitingTeam.abbreviation,
        start: new Date(event.time),
        end: new Date(event.time),
        id: event.id,
      };
      convertedEvents.push(convertedEvent);
    });
  });
  return convertedEvents;
}

const MyCalendar: FC = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, loading] = useAuthenticationStatus();
  const events = useAppSelector(state => state.games.monthGameData);
  const currentDate = useAppSelector(state => state.games.currentDate);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      dispatch(fetchGamesByMonth());
    }
    // Listen to changes on isAuthenticated, loading and currentDate.
  }, [isAuthenticated, loading, currentDate]);

  const selectEvent = (event: Event) => {
    console.log(event);
    const eventDateKey = format(new Date(event.start), "yyyy-MM-dd");
    const gamesOnDate = events[eventDateKey] as GameData[];
    const selectedGame = gamesOnDate.find(game => game.id === event.id);
    console.log(selectedGame);
    dispatch(setSelectedEvent(selectedGame));
    dispatch(setModalState({ modalOpen: true, modalType: 'event' }))
  }

  const convertedEvents = convertEvents(events || []);

  return (
    <div>
      {isAuthenticated ? (
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={convertedEvents}
          style={{ height: "91vh" }}
          selectable
          onSelectEvent={event => selectEvent(event)}
          onSelectSlot={slotInfo => console.log(slotInfo)}
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