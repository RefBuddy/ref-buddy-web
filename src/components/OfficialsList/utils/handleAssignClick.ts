import { addToQueue, removeFromGame } from '../../../store/Games/actions';
import {
  incrementQueueCount,
  decrementCount,
} from '../../../store/OfficialsList/reducer';

export const handleAssignClick = async (
  uid,
  isAssigned,
  date,
  gameNumber,
  role,
  dispatch,
  currentLeague,
  currentSeason,
) => {
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
