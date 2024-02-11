import { useAppSelector, useAppDispatch } from '../../../store';
import { addToQueue, removeFromGame } from '../../../store/Games/actions';
import { incrementQueueCount, decrementCount } from '../../../store/OfficialsList/reducer';


export const handleAssignClick = async (e, uid, isAssigned, date, gameNumber, role) => {
    const dispatch = useAppDispatch();
    const { currentLeague, currentSeason } = useAppSelector((state) => state.user);
    
    e.stopPropagation();

    if (isAssigned) {
        await dispatch(
            removeFromGame({
                uid: isAssigned.uid,
                date: date,
                gameNumber: gameNumber,
                league: currentLeague,
                season: currentSeason,
            }),
        );
        dispatch(decrementCount(isAssigned.uid));
    }

    const gameData = {
        uid: uid,
        role: role,
        date: date,
        gameNumber: gameNumber,
        league: currentLeague,
        season: currentSeason,
    };

    await dispatch(addToQueue(gameData));
    dispatch(incrementQueueCount(uid));
};