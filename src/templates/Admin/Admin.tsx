import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';

import { deleteUser } from '../../store/User/actions';
import { getOfficialsList } from '../../store/OfficialsList/actions';

import Navbar from '../../components/Navbar';
import { Loading } from '../../components/Loading';
import { ConfirmationModal } from '../../components/ConfirmationModal';

import OfficialsTable from './components/OfficialsTable';
import InviteUserCard from './components/InviteUserCard';

import { toast } from 'react-toastify';

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
    }
  }, [league]);

  const officials = useAppSelector((state) => state.officials.officialsList);
  const supervisors = useAppSelector(
    (state) => state.officials.supervisorsList,
  );

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
        <main className="flex flex-col items-center flex-1">
          <div className="flex justify-start items-start w-full p-5 pb-0">
            <InviteUserCard
              onConfirm={() => closeInviteUserModal()}
              openModal={isInviteUserModalOpen}
            />
          </div>
          <div className="flex flex-row flex-1 gap-12 pt-8">
            <div className="flex flex-col items-center flex-1">
              <h3>Officials</h3>
              <OfficialsTable
                officials={officials}
                handleDelete={handleDelete}
              />
            </div>

            <div className="flex flex-col items-center flex-1">
              <h3>Supervisors</h3>
              <OfficialsTable
                officials={supervisors}
                handleDelete={handleDelete}
              />
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
