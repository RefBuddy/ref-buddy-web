import React, { FC, useEffect } from 'react';
import {
  Calendar,
  Event as CalendarEvent,
  dateFnsLocalizer,
} from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuthenticationStatus } from '../../components/hooks';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchGamesByMonth } from '../../store/Games/actions';
import { setSelectedEvent, setSelectedGames } from '../../store/Games/reducer';
import { setModalState } from '../../store/Modal/reducer';
import CustomToolbar from './CustomToolbar/CustomToolbar';

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

const convertEvents = (events: MonthGameData[]): CalendarEvent[] => {
  const groupedEvents: { [date: string]: CalendarEvent } = {};
  
  Object.keys(events).forEach(key => {
    const eventsOnDate = events[key] as GameData[];
    eventsOnDate.forEach(event => {
      const eventDate = format(new Date(event.time), "yyyy-MM-dd");
      if (groupedEvents[eventDate]) {
        groupedEvents[eventDate].allDay = true;
        groupedEvents[eventDate].title += " ●";
      } else {
        groupedEvents[eventDate] = {
          title: "●",
          start: new Date(event.time),
          end: new Date(event.time),
          allDay: true,
          resource: event.id,
        };
      }
    });
  });

  return Object.values(groupedEvents);
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
  }, [isAuthenticated, loading, currentDate]);

  const selectEvent = (event: CalendarEvent) => {
    if (!events) return;
    const eventDateKey = format(new Date(event.start), "yyyy-MM-dd");
    const gamesOnDate = events[eventDateKey] as GameData[];
    const selectedGame = gamesOnDate.find(game => game.id === event.resource);

    dispatch(setSelectedEvent(selectedGame));
    dispatch(setModalState({ modalOpen: true, modalType: 'event' }))
  }

  const selectSlot = (slotInfo: { slots: Date[] }) => {
    if (!events) return;
    const slots = slotInfo.slots;
    const startTime = slots[0];
    const endTime = slots[slots.length - 1];
    const startKey = format(new Date(startTime), "yyyy-MM-dd");
    const endKey = format(new Date(endTime), "yyyy-MM-dd");

    const allEventsDuringSlots = Object.keys(events).filter(key => {
      const keyDate = new Date(key);
      if (keyDate >= new Date(startKey) && keyDate <= new Date(endKey)) {
        return true;
      }
      return false;
    })

    const gamesDuringSlots: GameData[] = [];
    allEventsDuringSlots.forEach(key => {
      const gamesOnDate = events[key] as GameData[];
      gamesOnDate.forEach(game => {
        gamesDuringSlots.push(game);
      })
    });

    dispatch(setSelectedGames(gamesDuringSlots));
    dispatch(setModalState({ modalOpen: true, modalType: 'games' }));
  }

  const convertedEvents = convertEvents(events || [] as any);

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4" >
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={convertedEvents}
            style={{ height: "60vh", width: "50vw", margin: "0 auto 2rem" }}
            selectable
            onSelectEvent={event => selectEvent(event)}
            onSelectSlot={slotInfo => selectSlot(slotInfo)}
            views={["month"]}
            components={{
              toolbar: CustomToolbar,
            }}
            eventPropGetter={
              () => {
                let newStyle = {
                  backgroundColor: "transparent",
                  color: "#10b981", 
                  fontSize: ".5rem",
                };
          
                return {
                  className: "",
                  style: newStyle
                };
              }
            }
            
          />
        </div>
      ) : (
        <p>Please log in to view the calendar</p>
      )}
      
    </div>
  );
};

export default MyCalendar;
