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

export {
  formatDate,
  formatTime,
}