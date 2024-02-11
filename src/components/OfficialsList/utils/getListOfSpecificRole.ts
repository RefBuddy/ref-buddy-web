export const getListOfSpecificRole = (officialsArray: any, showReferees: boolean, showLinesmen: boolean, role: string) => {
    return officialsArray.filter(
        (official) =>
            (showReferees && official.role?.Referee) ||
            (showLinesmen && official.role?.Linesman) ||
            role === 'supervisor',
    );
};