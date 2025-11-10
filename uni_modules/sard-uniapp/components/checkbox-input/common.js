import { defaultCheckboxPopoutProps, } from '../checkbox-popout/common';
import { defaultConfig } from '../config';
export const defaultCheckboxInputProps = () => ({
    ...defaultCheckboxPopoutProps(),
    ...defaultConfig.checkboxInput,
});
