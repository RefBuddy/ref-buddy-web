import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';

import OfficialsTable from './components/OfficialsTable';
import SupervisorsTable from './components/SupervisorsTable';
import { getOfficialsList } from '../../store/OfficialsList/actions';

const Admin: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.officials.loading);
  const league = useAppSelector((state) => state.user.currentLeague);

  useEffect(() => {
    if (league) {
      dispatch(getOfficialsList({ league }));
    }
  }, [league]);

  const officials = useAppSelector((state) => state.officials.officialsList);
  const supervisors = useAppSelector(
    (state) => state.officials.supervisorsList,
  );

  const handleDelete = (id: string) => {
    // Implement your delete logic here
    console.log(`Deleting item with id: ${id}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <main className="flex flex-col items-center flex-1">
          <h2>Admin</h2>

          <h3>Officials</h3>
          {officials ? (
            <OfficialsTable officials={officials} handleDelete={handleDelete} />
          ) : (
            <p>No officials data</p>
          )}

          <h3>Supervisors</h3>
          {supervisors ? (
            <SupervisorsTable
              supervisors={supervisors}
              handleDelete={handleDelete}
            />
          ) : (
            <p>No supervisors data</p>
          )}
        </main>
      )}
    </div>
  );
};

export default Admin;
