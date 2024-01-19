import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';

import { toast } from 'react-toastify';

import { deleteUser } from '../../store/User/actions';
import {
  getOfficialsList,
  getInvitedUsers,
} from '../../store/OfficialsList/actions';

import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import { ConfirmationModal } from '../../components/ConfirmationModal';

import OfficialsTable from './components/OfficialsTable';
import InviteUserCard from './components/InviteUserCard';
import InvitedUsersTable from './components/InvitedUsersTable';

const Admin: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.officials.loading);
  const league = useAppSelector((state) => state.user.currentLeague);

  const [isInviteUserModalOpen, setIsInviteUserModalOpen] =
    useState<boolean>(false);
  const [isConfirmationModalOpen, setisConfirmationModalOpen] =
    useState<boolean>(false);
  const [uid, deleteUid] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (league) {
      dispatch(getOfficialsList({ league }));
      dispatch(getInvitedUsers({ league }));
    }
  }, [league]);

  const officials = useAppSelector((state) => state.officials.officialsList);
  const supervisors = useAppSelector(
    (state) => state.officials.supervisorsList,
  );
  const invited = useAppSelector((state) => state.officials.invitedUsers);

  console.log(invited);

  const handleDelete = (uid: string) => {
    deleteUid(uid);
    setisConfirmationModalOpen(true);
  };

  const closeInviteUserModal = async () => {
    setIsLoading(true);
    await dispatch(getOfficialsList({ league }));
    setIsInviteUserModalOpen(false);
    setIsLoading(false);
    toast.success('User invited');
  };

  const closeConfirmationModal = async () => {
    await dispatch(getOfficialsList({ league }));
    setisConfirmationModalOpen(false);
    setIsLoading(false);
    toast.success('User deleted');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <main className="flex flex-col items-center flex-1 px-4 pt-4">
          <div className="flex flex-row justify-between items-start w-full pt-1 pb-0">
            <InviteUserCard
              onConfirm={() => closeInviteUserModal()}
              openModal={isInviteUserModalOpen}
            />
            {invited && invited.length > 0 && (
              <div className="flex flex-col">
                <h3 className="pb-2">Invited Users</h3>
                <div className="max-h-[160px] overflow-auto">
                  <InvitedUsersTable
                    invitedUsers={invited}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row flex-1 gap-12 pt-8">
            <div className="flex flex-col items-center flex-1">
              <h3 className="pb-2">Officials</h3>
              <div className="max-h-[60vh] overflow-auto">
                <OfficialsTable
                  officials={officials}
                  handleDelete={handleDelete}
                />
              </div>
            </div>

            <div className="flex flex-col items-center flex-1">
              <h3 className="pb-2">Supervisors</h3>
              <div className="max-h-[60vh] overflow-auto">
                <OfficialsTable
                  officials={supervisors}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={true}
          onCancel={() => {
            setIsLoading(false);
            setisConfirmationModalOpen(false);
          }}
          onConfirm={() => {
            setIsLoading(true);
            dispatch(deleteUser({ uid, league })).then(() => {
              closeConfirmationModal();
            });
          }}
          title="This action is irreversible"
          mainText="This user will be completely removed from the league. Are you sure you want to continue?"
        />
      )}

      {isLoading && <Loading />}
    </div>
  );
};

export default Admin;
