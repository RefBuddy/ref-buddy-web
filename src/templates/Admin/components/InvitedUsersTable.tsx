import React from 'react';

interface InvitedUsersTableProps {
  invitedUsers: InviteUserRequestData[];
  handleDelete: (email: string) => void;
}

const InvitedUsersTable: React.FC<InvitedUsersTableProps> = ({
  invitedUsers,
  handleDelete,
}) => {
  console.log(invitedUsers);
  return (
    <table className="table-auto border-collapse border border-green-800">
      <thead>
        <tr>
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
        {invitedUsers.map((user) => (
          <tr key={user.email}>
            <td className="border border-green-600 px-4 py-2 w-auto whitespace-nowrap">
              {user.email}
            </td>
            <td className="border border-green-600 px-4 py-2 text-center">
              Waiting to accept...
            </td>
            <td className="border border-green-600 px-4 py-2 text-center">
              <button onClick={() => handleDelete(user.email)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvitedUsersTable;
