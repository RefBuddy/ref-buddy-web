export const getLabel = (isAssigned: any, role: string) => {
    return isAssigned !== false
        ? isAssigned.name
        : role === 'referee1' || role === 'referee2'
        ? 'Referee'
        : role === 'supervisor'
        ? 'Supervisor'
        : 'Linesman';
};