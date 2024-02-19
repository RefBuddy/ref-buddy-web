import { parseISO } from 'date-fns';
import { formatDate } from '../../../utils/helpers';

export const getOfficialCalendarData = (uid: string, officialsCalendarData, game) => {
        if (!officialsCalendarData || !officialsCalendarData[uid]) {
            return null;
        }

        const blockedOffDates = officialsCalendarData[uid].blockedOffTimes;
        const currentSelectedDate = parseISO(game.time);
        const formattedTime = formatDate(currentSelectedDate);

        try {
            return blockedOffDates[formattedTime];
        } catch (error) {
            console.error('Error getting blocked off times for official', error);
            return null;
        }
};