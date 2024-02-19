import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { getAllOfficialsCalendarEvents } from '../../../store/User/actions';

export const fetchOfficialsCalendarEvents = (
    role: string,
    date: string,
    currentLeague: string,
    dispatch: ThunkDispatch<{}, {}, AnyAction>
) => {
    if (role !== 'dashboard') {
        dispatch(
            getAllOfficialsCalendarEvents({
                gameDate: date,
                league: currentLeague,
            }),
        );
    }
};