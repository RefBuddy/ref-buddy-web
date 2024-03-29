import React, { FC, useState, useEffect } from 'react';
import {
  Calendar,
  Event as CalendarEvent,
  dateFnsLocalizer,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuthenticationStatus } from '../hooks';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchGamesByMonth } from '../../store/Games/actions';
import { setSelectedGames } from '../../store/Games/reducer';
import { setModalState } from '../../store/Modal/reducer';
import CustomToolbar from './CustomToolbar/CustomToolbar';
import { SelectedGames } from './SelectedGames';
import Modal from '../Modal/Modal';

const CustomEvent = ({ event }) => {
  const greenEvents = event.events.filter(
    (event) =>
      event.officials.length === 5 &&
      event.officials.every((official) => official.status.confirmed === true),
  );
  const yellowEvents = event.events.filter(
    (event) =>
      event.officials.length === 5 &&
      event.officials.filter((official) => official.status.confirmed === true)
        .length < 5 &&
      event.officials.every((official) => official.status.declined === false),
  );
  const redEvents = event.events.filter(
    (event) =>
      event.officials.length < 5 ||
      event.officials.some((official) => official.status.declined === true),
  );

  return (
    <div className="text-red-500 flex flex-col flex-wrap">
      <div className="flex flex-row gap-1">
        {greenEvents.map((_) => (
          <span className="text-green-500 text-xs">●</span>
        ))}
      </div>
      <div className="flex flex-row gap-1 flex-wrap">
        {yellowEvents.map((_) => (
          <span className="text-warning-300 text-xs">●</span>
        ))}
      </div>
      <div className="flex flex-row gap-1 flex-wrap">
        {redEvents.map((_) => (
          <span className="text-error-500 text-xs">●</span>
        ))}
      </div>
    </div>
  );
};

const locales = {
  'en-US': require('date-fns'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const convertEvents = (events: MonthGameData[]): CalendarEvent[] => {
  const groupedEvents: { [date: string]: CalendarEvent } = {};

  Object.keys(events).forEach((key) => {
    const eventsOnDate = events[key] as GameData[];
    eventsOnDate.forEach((event) => {
      const eventDate = format(new Date(event.time), 'yyyy-MM-dd');
      if (groupedEvents[eventDate]) {
        groupedEvents[eventDate].allDay = true;
        groupedEvents[eventDate].events.push(event);
      } else {
        groupedEvents[eventDate] = {
          start: new Date(event.time),
          end: new Date(event.time),
          allDay: true,
          resource: event.id,
          events: [event],
        };
      }
    });
  });
  return Object.values(groupedEvents);
};

const MyCalendar: FC = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, loading] = useAuthenticationStatus();
  const events = useAppSelector((state) => state.games.monthGameData);
  const currentDate = useAppSelector((state) => state.games.currentDate);
  const [showSelectedGames, setShowSelectedGames] = useState(false);
  const league = useAppSelector((state) => state.user.currentLeague);

  const handleClick = () => {
    setShowSelectedGames(!showSelectedGames);
    dispatch(setModalState({ selectedGames: { open: !showSelectedGames } }));
  };

  useEffect(() => {
    if (isAuthenticated && !loading) {
      dispatch(fetchGamesByMonth());
    }
  }, [isAuthenticated, loading, currentDate, showSelectedGames]);

  const selectSlot = (slotInfo: { slots: Date[] }) => {
    if (!events) {
      return;
    }

    const { slots } = slotInfo;
    const startTime = slots[0];
    const endTime = slots[slots.length - 1];
    const startKey = format(new Date(startTime), 'yyyy-MM-dd');
    const endKey = format(new Date(endTime), 'yyyy-MM-dd');

    const allEventsDuringSlots = Object.keys(events).filter((key) => {
      const keyDate = new Date(key);
      return keyDate >= new Date(startKey) && keyDate <= new Date(endKey);
    });

    const gamesDuringSlots: GameData[] = [];
    allEventsDuringSlots.forEach((key) => {
      const gamesOnDate = events[key] as GameData[];
      gamesOnDate.forEach((game) => {
        gamesDuringSlots.push(game);
      });
    });

    if (gamesDuringSlots.length > 0) {
      dispatch(setSelectedGames(gamesDuringSlots));
      handleClick();
    } else if (showSelectedGames) {
      // Hide the modal if it's already showing
      handleClick();
    }
  };

  const convertedEvents = convertEvents(events || ([] as any));

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-0 border-gray-200 border-solid border rounded-lg shadow-sm px-4 ml-4">
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={convertedEvents}
            style={{ height: '63vh', width: '50vw', margin: '0 auto 2rem' }}
            selectable
            // onSelectEvent={event => selectEvent(event)}
            onSelectSlot={(slotInfo) => selectSlot(slotInfo)}
            views={['month']}
            components={{
              toolbar: CustomToolbar,
              eventWrapper: CustomEvent,
            }}
            eventPropGetter={(event) => {
              const newStyle = {
                backgroundColor: 'transparent',
                color: '#10b981',
                fontSize: '.5rem',
              };

              return {
                className: '',
                style: newStyle,
              };
            }}
          />
          {showSelectedGames && (
            <Modal onClose={() => handleClick()}>
              <SelectedGames onClose={() => handleClick()} />
            </Modal>
          )}
        </div>
      ) : (
        <p>Please log in to view the calendar</p>
      )}
    </div>
  );
};

export default MyCalendar;
