import React from 'react';
import { useAppSelector } from '../../store';
import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';

const Admin: React.FC<any> = () => {
  const loading = useAppSelector((state) => state.officials.loading);

  const officials = useAppSelector((state) => state.officials.officialsList);
  const supervisors = useAppSelector((state) => state.officials.supervisorsList);

  console.log("officials", officials);
  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
    <main className="flex flex-col items-center flex-1">
        {loading ? <Loading /> : null}
        <h2>Admin</h2>

        <h3>Officials</h3>
        <table className="table-auto border-collapse border border-green-800">
            <thead>
                <tr>
                    <th className="border border-green-600 px-4 py-2 text-green-800">Name</th>
                    <th className="border border-green-600 px-4 py-2 text-green-800">Email</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(officials).map((official) => (
                    <tr key={official.uid}>
                        <td className="border border-green-600 px-4 py-2">{official.firstName} {official.lastName}</td>
                        <td className="border border-green-600 px-4 py-2">{official.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <h3>Supervisors</h3>
        <table className="table-auto border-collapse border border-blue-800">
            <thead>
                <tr>
                    <th className="border border-blue-600 px-4 py-2 text-blue-800">Name</th>
                    <th className="border border-blue-600 px-4 py-2 text-blue-800">Email</th>
                </tr>
            </thead>
            <tbody>
                {Object.values(supervisors).map((supervisor) => (
                    <tr key={supervisor.uid}>
                        <td className="border border-blue-600 px-4 py-2">{supervisor.firstName} {supervisor.lastName}</td>
                        <td className="border border-blue-600 px-4 py-2">{supervisor.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </main>
    </div>
  );
};

export default Admin;