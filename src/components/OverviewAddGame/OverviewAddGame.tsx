import React, { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import CreateGame from '../Calendar/CreateGame/CreateGame';
import { useAppDispatch } from '../../store';
import { resetSavedGameState } from '../../store/Games/reducer';
import { Modal } from '../Modal';

const OverviewAddGame = () => {
  const dispatch = useAppDispatch();
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const handleClick = () => {
    setShowCreate(!showCreate);
  };

  const onCreateGameClose = () => {
    setShowCreate(false);
    dispatch(resetSavedGameState());
  };

  return (
    <div
      className="flex items-center justify-center gap-3 border-gray-200 border-solid border rounded-lg shadow-sm px-4 mx-4 h-48 w-56 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-start items-center w-full">
          <h6 className="text-gray-700 text-sm font-medium uppercase mt-10">
            Add New Game
          </h6>
        </div>
        <div className="flex justify-end items-end w-full mt-12">
          <PlusCircleIcon className="w-12 h-12 text-black" />
        </div>
      </div>

      {showCreate && (
        <Modal onClick={handleClick}>
          <CreateGame onClose={() => onCreateGameClose()} />
        </Modal>
      )}
    </div>
  );
};

export default OverviewAddGame;
