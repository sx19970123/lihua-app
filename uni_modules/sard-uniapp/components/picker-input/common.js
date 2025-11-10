import { defaultPickerPopoutProps, } from '../picker-popout/common';
import { defaultConfig } from '../config';
export const defaultPickerInputProps = () => ({
    ...defaultPickerPopoutProps(),
    ...defaultConfig.pickerInput,
});
