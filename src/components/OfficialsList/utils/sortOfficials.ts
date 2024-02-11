export const sortOfficials = (filtered: any) => {
    return filtered.sort((a, b) => {
        if (a.lastName && b.lastName) {
            return a.lastName.localeCompare(b.lastName);
        } else if (a.lastName) {
            return -1;
        } else if (b.lastName) {
            return 1;
        } else {
            return 0;
        }
    });
};