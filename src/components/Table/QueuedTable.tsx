import React, { useEffect, useMemo } from 'react';
import moment from 'moment-timezone';
import { useAppDispatch, useAppSelector } from '../../store';
import { Button } from '../Button';
import { releaseGame } from '../../store/Assigning/actions';
import { incrementAssignedCount } from '../../store/OfficialsList/reducer';
import LoadingSmall from '../Loading/LoadingSmall';
import { toast } from 'react-toastify';
import { fetchGamesByMonth } from '../../store/Games/actions';
import { setReleaseSuccessful } from '../../store/Assigning/reducer';

const QueuedTable = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.games.monthGameData);
  const { currentLeague, currentSeason } = useAppSelector(
    (state) => state.user,
  );
  const queuedGames = useMemo(() => {
    if (!events) return [];
    return Object.keys(events).flatMap((date) => {
      return events[date].filter((gameOnDate) => {
        if (currentLeague == 'bchl') {
          return gameOnDate.queue && gameOnDate.officials.length === 5; // Only include games with 5 officials in the queue
        } else {
          return gameOnDate.queue;
        }
      });
    });
  }, [events]);
  const officials = useAppSelector((state) => state.officials.officialsList);
  const supervisors = useAppSelector(
    (state) => state.officials.supervisorsList,
  );
  const loading = useAppSelector((state) => state.assigning.loading);
  const releaseSuccess = useAppSelector(
    (state) => state.assigning.releaseSuccessful,
  );
  const releaseError = useAppSelector((state) => state.assigning.error);

  useEffect(() => {
    if (releaseSuccess) {
      toast('Successfully released game!', { type: 'success' });
      dispatch(fetchGamesByMonth());
      dispatch(setReleaseSuccessful(false));
    }
  }, [releaseSuccess]);

  useEffect(() => {
    if (releaseError) {
      toast(releaseError, { type: 'error' });
    }
  }, [releaseError]);

  const getBackgroundColor = (idx) => {
    return idx % 2 === 0 ? 'bg-gray-200' : 'bg-white';
  };

  const release = async (game: GameData) => {
    const timezone =
      game.homeTeam && game.homeTeam.abbreviation === 'CRA'
        ? 'America/Denver'
        : 'America/Los_Angeles';
    const ISO = moment(game.time).tz(timezone).format('YYYY-MM-DD');
    const data = {
      uids: game.officials.map((off) => off.uid),
      date: ISO,
      gameNumber: game.gameNumber,
      league: currentLeague,
      season: currentSeason,
    } as ReleaseGameRequestData;
    await dispatch(releaseGame(data));
    dispatch(incrementAssignedCount(data.uids));
  };

  if (queuedGames.length === 0) {
    return null;
  }

  const groupByDate = (games) => {
    return games.reduce((acc, game) => {
      (acc[game.date] = acc[game.date] || []).push(game);
      return acc;
    }, {});
  };

  const releaseAll = async (gamesOnDate) => {
    for (const game of gamesOnDate) {
      await release(game);
    }
  };

  const groupedGames = groupByDate(queuedGames);

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-lg p-4 border-solid overflow-y-auto max-h-[529px]">
      <h4>
        Queued Games{' '}
        <span className="mx-8">
          {loading && <LoadingSmall color="black" />}
        </span>
      </h4>
      <table>
        <thead>
          <tr>
            <td className="p-2">Date</td>
            <td className="p-2">Teams</td>
            <td className="p-2">Officials</td>
            <td className="p-2">Supervisor</td>
            <td className="p-2">Actions</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedGames).map((date) => (
            <React.Fragment key={date}>
              <tr>
                <td className="p-2" colSpan={5}>
                  <div className="bg-white p-2 rounded-md flex justify-end">
                    <Button onClick={() => releaseAll(groupedGames[date])}>
                      Release{' '}
                      {date.substring(
                        date.indexOf(', ') + 2,
                        date.indexOf(',', date.indexOf(',') + 1),
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
              {groupedGames[date].map((game, idx) => {
                const officialsInGame = game.officials.filter(
                  (off) => off.role !== 'supervisor',
                );
                const supervisor = game.officials.find(
                  (off) => off.role === 'supervisor',
                );

                const officialNames = officialsInGame
                  .map((off) =>
                    officials[off.uid]
                      ? `${officials[off.uid].firstName} ${
                          officials[off.uid].lastName
                        }`
                      : 'Unknown official',
                  )
                  .join(', ');

                const supervisorName =
                  supervisor && supervisors[supervisor.uid]
                    ? `${supervisors[supervisor.uid].firstName} ${
                        supervisors[supervisor.uid].lastName
                      }`
                    : 'empty';

                return (
                  <tr key={`queued-${idx}`} className={getBackgroundColor(idx)}>
                    <td className="text-xs p-2">{game.date}</td>
                    <td className="text-xs p-2">
                      {game.visitingTeam.abbreviation} @{' '}
                      {game.homeTeam.abbreviation}
                    </td>
                    <td className="text-xs p-2">{officialNames}</td>
                    <td className="text-xs p-2">{supervisorName}</td>
                    <td className="text-xs p-2">
                      <Button onClick={() => release(game)}>Release</Button>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueuedTable;
