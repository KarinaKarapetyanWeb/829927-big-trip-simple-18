import dayjs from 'dayjs';

const getTodayDate = () => dayjs().toISOString();

const humanizeDate = (date) => dayjs(date).format('D MMM');

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatFormDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export { getTodayDate, humanizeDate, formatDate, formatTime, formatFormDate };
