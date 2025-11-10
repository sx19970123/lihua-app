import { defaultConfig } from '../config';
export const defaultRadioPopoutProps = () => ({
    ...defaultConfig.radioPopout,
    options: () => [],
});
