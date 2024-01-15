import React, { useState } from 'react';

import { PlusCircleIcon } from '@heroicons/react/24/solid';

import InviteUserModal from './InviteUserModal';

interface InviteUserCardProps {
  openModal: boolean;
  onConfirm: () => void;
}

const InviteUserCard = ({ onConfirm, openModal }: InviteUserCardProps) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(openModal);

  const handleClick = () => {
    setShowInviteModal(!showInviteModal);
  };

  const closeModal = () => {
    setShowInviteModal(false);
  };

  return (
    <div
      className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between w-full cursor-pointer">
        <div className="flex justify-start items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase mt-10">
            Invite Official
          </h6>
        </div>
        <div className="flex justify-end items-end w-full mt-12">
          <PlusCircleIcon className="w-12 h-12 text-black" />
        </div>
      </div>

      {showInviteModal && (
        <InviteUserModal onClose={closeModal} onConfirm={onConfirm} />
      )}
    </div>
  );
};

export default InviteUserCard;
