export const getRoleDetails = (role: string) => {
    return role === 'referee1' || role === 'referee2'
        ? 'Referee'
        : role === 'supervisor'
        ? 'Supervisor'
        : 'Linesman';
};