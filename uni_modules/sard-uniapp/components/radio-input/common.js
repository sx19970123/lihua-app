import { defaultRadioPopoutProps, } from '../radio-popout/common';
import { defaultConfig } from '../config';
export const defaultRadioInputProps = () => ({
    ...defaultRadioPopoutProps(),
    ...defaultConfig.radioInput,
});
