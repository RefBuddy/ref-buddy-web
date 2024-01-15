import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAppDispatch, useAppSelector } from '../../store';
import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import { getLeagueStats } from '../../store/Stats/actions';
import {
  GamesOfficiatedByLinesmen,
  GamesOfficiatedByReferees,
  LinesmenAverageGoalsPerGame,
  LinesmenAverageInfractionsPerGame,
  PenaltyMinutesByTeam,
  RefereeAverageInfractionsPerGame,
  RefereesAverageGoalsPerGame,
  RoleDistribution,
  TotalInfractionsByTeam,
} from '../../components/Charts';

const Stats: React.FC<any> = () => {
  Chart.register(...registerables);
  const loading = useAppSelector(
    (state) =>
      state.games.loading || state.user.loading || state.officials.loading,
  );
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.user.currentLeague);
  const season = useAppSelector((state) => state.user.currentSeason);
  const stats = useAppSelector((state) => state.stats.stats);

  useEffect(() => {
    if (league && season) {
      dispatch(getLeagueStats({ league, season }));
    }
  }, [league, season]);

  const statsView = (
    <>
      <h2>Stats</h2>
      <h3>League</h3>
      <RoleDistribution data={stats} />
      <h3>Teams</h3>
      <PenaltyMinutesByTeam data={stats} />
      <TotalInfractionsByTeam data={stats} />
      <h3>Referees</h3>
      <RefereeAverageInfractionsPerGame data={stats} />
      <RefereesAverageGoalsPerGame data={stats} />
      <GamesOfficiatedByReferees data={stats} />
      <h3>Linesmen</h3>
      <LinesmenAverageInfractionsPerGame data={stats} />
      <LinesmenAverageGoalsPerGame data={stats} />
      <GamesOfficiatedByLinesmen data={stats} />
    </>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main className="flex flex-col items-center flex-1">
        {loading && <Loading />}
        {!loading && statsView}
      </main>
    </div>
  );
};

export default Stats;
