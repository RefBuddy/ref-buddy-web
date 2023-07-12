import { format } from 'date-fns';

const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
}

const formatTime = (time: string): string => {
  const date = new Date(time);
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

const format24HourTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true, hourCycle: 'h12' });
}

export {
  formatDate,
  formatTime,
  format24HourTime
}