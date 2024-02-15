import React from 'react';
import { Button } from '../../../Button';
import * as Utils from '../../utils';

const ReplaceOrAssignButton = ({ official, isAssigned, date, gameNumber, role, dispatch, currentLeague, currentSeason, officialsOrSupervisors, close }) => (
    <Button onClick={async (e) => {
        await Utils.handleAssignClick(e, official.uid, isAssigned, date, gameNumber, role, dispatch, currentLeague, currentSeason);
        Utils.toastFeedback(official.uid, isAssigned, officialsOrSupervisors);
        close();
    }}>
        {isAssigned && role != 'supervisor'
            ? 'Replace Official'
            : 'Assign + '}
    </Button>
);

export default ReplaceOrAssignButton;