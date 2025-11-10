import { getAvailableImperative } from '../../use';
import { defaultConfig } from '../config';
import { defaultCropImageProps } from '../crop-image/common';
export const defaultCropImageAgentProps = () => ({
    ...defaultCropImageProps,
    ...defaultConfig.cropImageAgent,
});
export const imperativeName = 'cropImage';
const cropImage = (options) => {
    const { id = defaultConfig.cropImageAgent.id } = options;
    const imperative = getAvailableImperative(imperativeName, id);
    if (imperative) {
        imperative.show(options);
    }
};
export { cropImage };
