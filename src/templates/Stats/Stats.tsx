import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import { getLeagueStats } from '../../store/Stats/actions';

const Stats: React.FC<any> = () => {
  const loading = useAppSelector(
    (state) =>
      state.games.loading || state.user.loading || state.officials.loading,
  );
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.user.currentLeague);
  const season = useAppSelector((state) => state.user.currentSeason);

  useEffect(() => {
    if (league && season) {
      dispatch(getLeagueStats({ league, season }));
    }
  }, [league, season]);

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main className="flex flex-col items-center flex-1">
        {loading ? <Loading /> : null}
        <h2>Stats</h2>
      </main>
    </div>
  );
};

export default Stats;
