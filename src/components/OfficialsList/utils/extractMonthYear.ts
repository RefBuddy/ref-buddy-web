export const extractMonthYear = (dateStr, currentDate) => {
        if (dateStr === '2021-10-10') {
            dateStr = currentDate;
        }
        const dateObj = new Date(dateStr);
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
            2,
            '0',
        )}`;
};