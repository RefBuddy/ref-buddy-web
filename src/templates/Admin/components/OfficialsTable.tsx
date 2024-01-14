import React, { useState } from 'react';

interface OfficialsTableProps {
  officials: { [uid: string]: OfficialData };
  handleDelete: (uid: string) => void;
}

const OfficialsTable: React.FC<OfficialsTableProps> = ({
  officials,
  handleDelete,
}) => {
  const [sortName, setSortName] = useState<'asc' | 'desc' | ''>('asc');
  const [sortStatus, setSortStatus] = useState<'asc' | 'desc' | ''>('asc');

  const sortOfficials = (officials: { [uid: string]: OfficialData }) => {
    return Object.values(officials).sort((a, b) => {
      if (sortName !== '') {
        const nameA = a.lastName.toUpperCase();
        const nameB = b.lastName.toUpperCase();
        if (nameA < nameB) return sortName === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortName === 'asc' ? 1 : -1;
      }

      if (sortStatus !== '') {
        const statusA = a.firstName ? 1 : 0;
        const statusB = b.firstName ? 1 : 0;
        return sortStatus === 'asc' ? statusA - statusB : statusB - statusA;
      }

      return 0;
    });
  };

  return (
    <table className="table-auto border-collapse border border-green-800">
      <thead>
        <tr>
          <th className="border border-green-600 px-4 py-2 text-green-800">
            <button
              onClick={() => setSortName(sortName === 'asc' ? 'desc' : 'asc')}
            >
              Name {sortName === 'asc' ? '↑' : sortName === 'desc' ? '↓' : ''}
            </button>
          </th>
          <th className="border border-green-600 px-4 py-2 text-green-800">
            Email
          </th>
          <th className="border border-green-600 px-4 py-2 text-green-800">
            <button
              onClick={() =>
                setSortStatus(sortStatus === 'asc' ? 'desc' : 'asc')
              }
            >
              Status{' '}
              {sortStatus === 'asc' ? '↑' : sortStatus === 'desc' ? '↓' : ''}
            </button>
          </th>
          <th className="border border-green-600 px-4 py-2 text-green-800">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {sortOfficials(officials).map((official) => (
          <tr key={official.uid}>
            <td className="border border-green-600 px-4 py-2">
              {official.firstName} {official.lastName}
            </td>
            <td className="border border-green-600 px-4 py-2">
              {official.email}
            </td>
            <td className="border border-green-600 px-4 py-2 text-center">
              {official.firstName ? '✅' : 'Waiting to accept...'}
            </td>
            <td className="border border-green-600 px-4 py-2 text-center">
              <button onClick={() => handleDelete(official.uid)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OfficialsTable;
