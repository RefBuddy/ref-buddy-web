import React from 'react';

interface SupervisorsTableProps {
  supervisors: { [uid: string]: OfficialData };
  handleDelete: (uid: string) => void;
}

const SupervisorsTable: React.FC<SupervisorsTableProps> = ({
  supervisors,
  handleDelete,
}) => (
  <table className="table-auto border-collapse border border-blue-800">
    <thead>
      <tr>
        <th className="border border-blue-600 px-4 py-2 text-blue-800">Name</th>
        <th className="border border-blue-600 px-4 py-2 text-blue-800">
          Email
        </th>
        <th className="border border-blue-600 px-4 py-2 text-blue-800">
          Status
        </th>
        <th className="border border-blue-600 px-4 py-2 text-blue-800">
          Options
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.values(supervisors).map((supervisor) => (
        <tr key={supervisor.uid}>
          <td className="border border-blue-600 px-4 py-2">
            {supervisor.firstName} {supervisor.lastName}
          </td>
          <td className="border border-blue-600 px-4 py-2">
            {supervisor.email}
          </td>
          <td className="border border-blue-600 px-4 py-2">
            {supervisor.firstName ? '✅' : 'Waiting to accept...'}
          </td>
          <td className="border border-blue-600 px-4 py-2">
            <button onClick={() => handleDelete(supervisor.uid)}>🗑️</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SupervisorsTable;
