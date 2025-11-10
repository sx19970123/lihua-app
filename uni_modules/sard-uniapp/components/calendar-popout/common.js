import { defaultConfig } from '../config';
export const defaultCalendarPopoutProps = () => ({
    ...defaultConfig.calendar,
    ...defaultConfig.calendarPopout,
});
