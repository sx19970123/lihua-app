import { defaultConfig } from '../config';
export const defaultCalendarProps = defaultConfig.calendar;
export const getMinDate = (severalMonths) => {
    const date = new Date();
    if (severalMonths) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(date.getFullYear() - 10, 0, 1);
};
export const getMaxDate = (severalMonths) => {
    const date = new Date();
    if (severalMonths) {
        return new Date(date.getFullYear(), date.getMonth() + 3, 0);
    }
    return new Date(date.getFullYear() + 10, 11, 31);
};
export const sortDates = (dates) => {
    return dates.sort((a, b) => a.getTime() - b.getTime());
};
export const weeksIndex = [0, 1, 2, 3, 4, 5, 6];
