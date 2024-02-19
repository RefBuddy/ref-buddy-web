import {
    updateOfficialRole,
} from '../../../store/User/actions';
import { getOfficialsList } from '../../../store/OfficialsList/actions';
import { toast } from 'react-toastify';

export const updateUserRole = async (uid, officialsData, officialsOrSupervisors, currentLeague, dispatch, setOfficialsData) => {
        if (!officialsData) return;

        const filteredOfficialProfileInfoKey = Object.keys(officialsOrSupervisors).filter(
            (key) => key === uid,
        );

        if (filteredOfficialProfileInfoKey.length > 0) {
            const updatedOfficialProfile = {
                ...officialsOrSupervisors[filteredOfficialProfileInfoKey[0]],
            };

            // Ensure that the official's role is updated in the fetched data before dispatching the update action
            updatedOfficialProfile.role = {
                ...updatedOfficialProfile.role,
                Linesman: officialsData.role.Linesman,
                Referee: officialsData.role.Referee,
            };

            await handleRoleChange(uid, updatedOfficialProfile.role, currentLeague, dispatch);

            setOfficialsData(updatedOfficialProfile);

            dispatch(getOfficialsList({ league: currentLeague }));

            toast.success('Role updated successfully');
        } else {
            toast.error('Error updating role');
        }
};

export const handleRoleChange = async (uid, role, currentLeague, dispatch) => {
    try {
      await dispatch(
        updateOfficialRole({
          uid: uid,
          role: role,
          league: currentLeague,
        }),
      );
    } catch (error) {
      console.error('Error updating role:', error);
    }
};