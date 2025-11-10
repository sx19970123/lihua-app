import { defaultConfig } from '../config';
export const defaultCheckboxPopoutProps = () => ({
    ...defaultConfig.checkboxPopout,
    options: () => [],
});
