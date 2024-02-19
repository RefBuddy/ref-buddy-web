import { getUserCalendarEvents } from '../../../store/User/actions';

export const expandOrCloseUserInformation = (e, uid, officialClicked, setOfficialsData, setOfficialClicked, isOfficialHovered, officialsOrSupervisors, dispatch) => {
        if (e.target.type === 'checkbox' || e.target.type === 'button') {
            return;
        }

        e.stopPropagation();

        // Close user information if the clicked user is already being displayed
        if (officialClicked === uid) {
            setOfficialsData(undefined);
            setOfficialClicked('');
            return;
        }

        if (isOfficialHovered(uid)) {
            const filteredOfficialProfileInfoKey = Object.keys(officialsOrSupervisors).filter(
                (key) => key === uid,
            );
            if (filteredOfficialProfileInfoKey.length > 0) {
                const filterOfficialProfile =
                    officialsOrSupervisors[filteredOfficialProfileInfoKey[0]];
                setOfficialsData(filterOfficialProfile);
                setOfficialClicked(uid);
                dispatch(getUserCalendarEvents({ uid: uid }));
            }
        }
};