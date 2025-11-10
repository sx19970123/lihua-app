import { defaultConfig } from '../config';
export const defaultLoadingProps = () => ({
    ...defaultConfig.loading,
    animated: true,
    progress: 1,
});
