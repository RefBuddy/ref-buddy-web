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
import { setCurrentDate, setSelectedEvent, setSelectedGames } from '../../store/Games/reducer';
import { setModalState } from '../../store/Modal/reducer';
import { formatDate } from '../../utils/helpers';


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
    const eventDateKey = format(new Date(event.start), "yyyy-MM-dd");
    const gamesOnDate = events[eventDateKey] as GameData[];
    const selectedGame = gamesOnDate.find(game => game.id === event.id);

    dispatch(setSelectedEvent(selectedGame));
    dispatch(setModalState({ modalOpen: true, modalType: 'event' }))
  }

  const selectSlot = (slotInfo: any) => {
    console.log(slotInfo);
    // get array of slot selections
    const slots = slotInfo.slots;
    // get start and end times of first slot
    const startTime = slots[0];
    const endTime = slots[slots.length - 1];
    // get date of first slot
    const startKey = format(new Date(startTime), "yyyy-MM-dd");
    // get games on date of first slot
    const endKey = format(new Date(endTime), "yyyy-MM-dd");
    console.log(endKey);
    const allEventsDuringSlots = Object.keys(events).filter(key => {
      // check if key which is a date string is in between startKey and endKey
      const keyDate = new Date(key);
      if (keyDate >= new Date(startKey) && keyDate <= new Date(endKey)) {
        return true;
      }
      return false;
    })

    console.log(allEventsDuringSlots);

    const gamesDuringSlots: GameData[] = [];
    // Unsure on how you want your grouping. I just put all games in an array.
    allEventsDuringSlots.forEach(key => {
      const gamesOnDate = events[key] as GameData[];
      gamesOnDate.forEach(game => {
        gamesDuringSlots.push(game);
      })
    });
    dispatch(setSelectedGames(gamesDuringSlots));
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
          onSelectSlot={slotInfo => selectSlot(slotInfo)}
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