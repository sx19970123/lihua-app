import { defaultConfig } from '../config';
export const defaultDatetimePickerPopoutProps = () => ({
    ...defaultConfig.datetimePicker,
    ...defaultConfig.datetimePickerPopout,
});
