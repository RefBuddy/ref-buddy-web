export const getOfficialsArray = (officialsOrSupervisors: any) => {
    return Object.keys(officialsOrSupervisors).map((key) => officialsOrSupervisors[key]);
};