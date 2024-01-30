import React from 'react';

interface InvitedUsersTableProps {
  invitedUsers: InviteUserRequestData[];
  handleDelete: (email: string) => void;
}

const InvitedUsersTable: React.FC<InvitedUsersTableProps> = ({
  invitedUsers,
  handleDelete,
}) => {
  return (
    <table className="min-w-full leading-normal border border-green-800">
      <thead>
        <tr>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Email
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Options
          </th>
        </tr>
      </thead>
      <tbody>
        {invitedUsers.map((user) => (
          <tr key={user.email} className="hover:bg-gray-100">
            <td className="px-4 py-2 w-auto whitespace-nowrap">
              {user.email}
            </td>
            <td className="px-4 py-2 text-center">
              <button onClick={() => handleDelete(user.email)}>
                <svg className="w-6 h-6 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
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

export default InvitedUsersTable;
