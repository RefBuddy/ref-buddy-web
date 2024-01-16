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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center items-center">
        <RoleDistribution data={stats} />
        <div className="mt-8">
          <PenaltyMinutesByTeam data={stats} />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <h2 className="mt-8">Referees</h2>
          <RefereeAverageInfractionsPerGame data={stats} />
          <RefereesAverageGoalsPerGame data={stats} />
          <GamesOfficiatedByReferees data={stats} />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="mt-8">Linespeople</h2>
          <LinesmenAverageInfractionsPerGame data={stats} />
          <LinesmenAverageGoalsPerGame data={stats} />
          <GamesOfficiatedByLinesmen data={stats} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main className="flex flex-wrap justify-center p-4 gap-12">
        {loading && <Loading />}
        {!loading && statsView}
      </main>
    </div>
  );
};

export default Stats;
