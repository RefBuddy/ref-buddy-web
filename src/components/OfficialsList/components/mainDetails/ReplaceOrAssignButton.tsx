import React, { useState } from 'react';
import { Button } from '../../../Button';
import * as Utils from '../../utils';
import { ConfirmationModal } from '../../../ConfirmationModal';

const ReplaceOrAssignButton = ({
  official,
  isAssigned,
  date,
  gameNumber,
  role,
  dispatch,
  currentLeague,
  currentSeason,
  officialsOrSupervisors,
  close,
  alreadyWorkingAGameToday,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleAssign = async () => {
    await Utils.handleAssignClick(
      official.uid,
      isAssigned,
      date,
      gameNumber,
      role,
      dispatch,
      currentLeague,
      currentSeason,
    );
    Utils.toastFeedback(official.uid, isAssigned, officialsOrSupervisors);
    handleCloseModal();
    close();
  };

  const handleClick = (e) => {
    if (
      alreadyWorkingAGameToday &&
      role !== 'supervisor' &&
      currentLeague === 'bchl'
    ) {
      setShowModal(true);
    } else {
      e.stopPropagation();
      handleAssign();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>
        {isAssigned && role != 'supervisor' ? 'Replace Official' : 'Assign + '}
      </Button>
      {showModal && (
        <ConfirmationModal
          isOpen={showModal}
          onCancel={handleCloseModal}
          onConfirm={handleAssign}
          title={`${official.firstName} ${official.lastName} is already working a game today`}
          mainText="Are you sure you want to assign them to this game?"
        />
      )}
    </div>
  );
};

export default ReplaceOrAssignButton;
