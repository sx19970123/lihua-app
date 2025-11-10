import { defaultPickerProps, } from '../picker/common';
import { defaultConfig } from '../config';
export const defaultPickerPopoutProps = () => ({
    ...defaultPickerProps(),
    ...defaultConfig.pickerPopout,
});
