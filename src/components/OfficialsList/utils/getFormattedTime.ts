export const getFormattedTime = (isoTime: string) => {
        const date = new Date(isoTime);
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
        };
        return date.toLocaleTimeString('en-US', options);
};