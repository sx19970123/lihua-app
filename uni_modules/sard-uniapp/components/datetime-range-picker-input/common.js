import { defaultConfig } from '../config';
export const defaultDatetimeRangePickerInputProps = () => ({
    ...defaultConfig.datetimeRangePicker,
    ...defaultConfig.datetimeRangePickerPopout,
    ...defaultConfig.datetimeRangePickerInput,
});
