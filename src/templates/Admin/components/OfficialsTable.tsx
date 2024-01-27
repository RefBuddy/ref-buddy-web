import React, { useState } from 'react';

interface OfficialsTableProps {
  officials: { [uid: string]: OfficialTableData };
  handleDelete: (uid: string) => void;
}

const OfficialsTable: React.FC<OfficialsTableProps> = ({
  officials,
  handleDelete,
}) => {
  const [sortName, setSortName] = useState<'asc' | 'desc' | ''>('asc');

  const sortOfficials = (officials: { [uid: string]: OfficialTableData }) => {
    return Object.values(officials)
      .filter(
        (official) =>
          !(official.firstName === 'No' && official.lastName === 'Supervisor'),
      )
      .sort((a, b) => {
        if (sortName !== '') {
          const nameA = a.lastName.toUpperCase();
          const nameB = b.lastName.toUpperCase();
          if (nameA < nameB) return sortName === 'asc' ? -1 : 1;
          if (nameA > nameB) return sortName === 'asc' ? 1 : -1;
        }
        return 0;
      });
  };

  return (
    <table className="min-w-full leading-normal border border-green-800">
      <thead>
        <tr>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <button
              className="focus:outline-none uppercase"
              onClick={() => setSortName(sortName === 'asc' ? 'desc' : 'asc')}
            >
              Name {sortName === 'asc' ? '↑' : sortName === 'desc' ? '↓' : ''}
            </button>
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {sortOfficials(officials).map((official) => (
          <tr key={official.uid} className="hover:bg-gray-100">
            <td className="px-5 py-3 border-b border-gray-200 text-sm  w-auto whitespace-nowrap">
              <strong>{official.lastName}</strong>, {official.firstName}
            </td>
            <td className="px-5 py-3 border-b border-gray-200 text-sm">
              {official.email}
            </td>
            <td className="px-5 py-3 border-b border-gray-200 text-sm">
              <span className="inline-block py-1 font-semibold text-green-900 leading-tight">
                <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                <span>Active</span>
              </span>
            </td>
            <td className="px-5 py-3 border-b border-gray-200 text-sm text-center">
            <button
              className="focus:outline-none"
              onClick={() => handleDelete(official.uid)}
            >
              <svg className="w-6 h-6 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <title>Delete user</title>
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OfficialsTable;
