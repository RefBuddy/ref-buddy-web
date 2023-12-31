import React, { useState } from 'react';
import {
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import OfficialsList from '../../../../OfficialsList/OfficialsList';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { setModalState } from '../../../../../store/Modal/reducer';
import { decrementCount } from '../../../../../store/OfficialsList/reducer';
import { removeFromGame } from '../../../../../store/Games/actions';
import { Modal } from '../../../../Modal';

const UserProfile = ({ userData }) => {
  const name = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="flex items-center">
      <img
        className="rounded-full max-w-[50px] max-h-[50px] object-cover h-[50px] w-[50px]"
        src={userData.profilePictureUrl}
        alt={name}
      />
      <div className="flex flex-col ml-1">
        <p className="text-left">{userData.firstName}</p>
        <p className="text-left -mt-1">{userData.lastName}</p>
      </div>
    </div>
  );
};

const OfficialBox = ({ gameData, official, role, label }) => {
  const dispatch = useAppDispatch();
  const { currentLeague, currentSeason } = useAppSelector(
    (state) => state.user,
  );
  const [isHovered, setIsHovered] = useState(false);
  const officialStatus =
    official &&
    gameData.officials?.find((off) => off.uid === official.uid)?.status;
  const [showOfficialsList, setShowOfficialsList] = useState(false);

  const handleClick = () => {
    setShowOfficialsList(!showOfficialsList);
    dispatch(setModalState({ selectedGames: { open: !showOfficialsList } }));
  };

  const removeOfficialFromGame = (event) => {
    event.stopPropagation();
    if (official) {
      dispatch(
        removeFromGame({
          uid: official.uid,
          date: gameData.time.slice(0, 10),
          gameNumber: gameData.gameNumber,
          league: currentLeague,
          season: currentSeason,
        }),
      );
      dispatch(decrementCount(official.uid));
      toast.success(
        `${official.firstName} ${official.lastName} removed from game.`,
      );
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center border-2 rounded-md p-1 cursor-pointer relative min-h-14 flex-none w-36 shadow-md ${
          label === 'Referee'
            ? 'border-orange-500'
            : label === 'Linesman'
            ? 'border-black'
            : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        {official ? (
          <UserProfile userData={official} />
        ) : (
          <div>Add {label}</div>
        )}
        {official && (
          <>
            {officialStatus && officialStatus.declined && (
              <p className="absolute top-0 right-1" aria-hidden="true">
                ❌
              </p>
            )}
            {officialStatus &&
              !officialStatus.confirmed &&
              !officialStatus.declined && (
                <ExclamationTriangleIcon
                  className="w-5 h-5 text-warning-300 absolute top-0.5 right-0.5"
                  aria-hidden="true"
                />
              )}
          </>
        )}
        {isHovered && official && (
          <button
            onClick={(event) => removeOfficialFromGame(event)}
            className="absolute top-3 left-3 transform translate-x-[-50%] translate-y-[-50%] bg-white rounded-full"
          >
            <XCircleIcon
              className="w-5 h-5 text-gray-500 hover:text-red-500"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {showOfficialsList && (
        <Modal onClose={() => handleClick()}>
          <OfficialsList
            game={gameData}
            role={role}
            close={handleClick}
            isAssigned={
              official
                ? {
                    name: official.firstName + ' ' + official.lastName,
                    uid: official.uid,
                  }
                : false
            }
          />
        </Modal>
      )}
    </>
  );
};

export default OfficialBox;
