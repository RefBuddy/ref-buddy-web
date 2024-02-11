import { useAppSelector } from '../../../store';

export const getOfficialsOrSupervisors = (role: string) => {
    return role === 'supervisor'
        ? useAppSelector((state) => state.officials.supervisorsList)
        : useAppSelector((state) => state.officials.officialsList);
};