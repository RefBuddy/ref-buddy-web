export const filterAndSortOfficials = (
    officialsOrSupervisors: any,
    showReferees: boolean,
    showLinesmen: boolean,
    searchTerm: string = '',
) => {
    const searchTermLowerCase = searchTerm.toLowerCase();

    const officialsArray = Object.keys(officialsOrSupervisors).map((key) => officialsOrSupervisors[key]);

    const filtered = officialsArray.filter(
        (official) =>
            ((showReferees && official.role.Referee) ||
                (showLinesmen && official.role.Linesman)) &&
            (official.firstName.toLowerCase().includes(searchTermLowerCase) ||
                official.lastName.toLowerCase().includes(searchTermLowerCase) ||
                official.city.toLowerCase().includes(searchTermLowerCase)),
    );

    const sortedOfficials = filtered.sort((a, b) =>
        a.lastName.localeCompare(b.lastName),
    );

    return sortedOfficials;
};