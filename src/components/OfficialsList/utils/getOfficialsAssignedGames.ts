import { parseISO } from 'date-fns';
import { formatDate } from '../../../utils/helpers';

export const getOfficialsAssignedGames = (uid: string, officialsCalendarData, game) => {
        if (!officialsCalendarData || !officialsCalendarData[uid]) {
            return null;
        }

        let assignedGames = officialsCalendarData[uid].assignedGames || {};
        const queuedGames = officialsCalendarData[uid].queuedGames || {};
        const currentSelectedDate = parseISO(game.time);
        const formattedTime = formatDate(currentSelectedDate);

        // add queued games to assigned games
        if (queuedGames && queuedGames[formattedTime]) {
            // Create a copy of assignedGames to prevent mutation of the original data
            assignedGames = { ...assignedGames };
            assignedGames[formattedTime] = queuedGames[formattedTime];
        }

        try {
            return assignedGames[formattedTime];
        } catch (error) {
            return null;
        }
};