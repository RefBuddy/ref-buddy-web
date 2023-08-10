import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { UsersIcon } from '@heroicons/react/24/solid';
import OfficialsList from '../OfficialsList/OfficialsList';
import { setModalState } from '../../store/Modal/reducer';
import { Modal } from '../Modal';

const OverviewOfficials = () => {
  const dispatch = useAppDispatch();
  const [showOfficialsList, setShowOfficialsList] = useState(false);

  const handleClick = () => {
    setShowOfficialsList(!showOfficialsList);
    dispatch(setModalState({ officialsList: { open: !showOfficialsList } }));
  };

  const game = {
    time: '2021-10-10T01:00:00.000Z',
    gameNumber: 1,
  };

  return (
    <div className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-start items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase mt-10">
            Officials
          </h6>
        </div>
        <div className="flex justify-end items-end w-full mt-12">
          <UsersIcon className="w-14 h-14 text-black" />
        </div>
      </div>

      {showOfficialsList && (
        <Modal onClick={handleClick}>
          <OfficialsList game={game} role='dashboard' isAssigned={false} />
        </Modal>
      )}
    </div>
  );
};

export default OverviewOfficials;
