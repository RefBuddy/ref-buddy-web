import React from 'react';

interface OfficialsTableProps {
  officials: { [uid: string]: OfficialData };
  handleDelete: (uid: string) => void;
}

const OfficialsTable: React.FC<OfficialsTableProps> = ({
  officials,
  handleDelete,
}) => (
  <table className="table-auto border-collapse border border-green-800">
    <thead>
      <tr>
        <th className="border border-green-600 px-4 py-2 text-green-800">
          Name
        </th>
        <th className="border border-green-600 px-4 py-2 text-green-800">
          Email
        </th>
        <th className="border border-green-600 px-4 py-2 text-green-800">
          Status
        </th>
        <th className="border border-green-600 px-4 py-2 text-green-800">
          Options
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.values(officials).map((official) => (
        <tr key={official.uid}>
          <td className="border border-green-600 px-4 py-2">
            {official.firstName} {official.lastName}
          </td>
          <td className="border border-green-600 px-4 py-2">
            {official.email}
          </td>
          <td className="border border-green-600 px-4 py-2">
            {official.firstName ? '✅' : 'Waiting to accept...'}
          </td>
          <td className="border border-green-600 px-4 py-2">
            <button onClick={() => handleDelete(official.uid)}>🗑️</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OfficialsTable;
