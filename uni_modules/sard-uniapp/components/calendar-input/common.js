import { defaultConfig } from '../config';
export const defaultCalendarInputProps = () => ({
    ...defaultConfig.calendar,
    ...defaultConfig.calendarPopout,
    ...defaultConfig.calendarInput,
});
