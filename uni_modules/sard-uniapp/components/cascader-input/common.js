import { defaultConfig } from '../config';
export const defaultCascaderInputProps = () => ({
    ...defaultConfig.cascaderPopout,
    ...defaultConfig.cascaderInput,
});
