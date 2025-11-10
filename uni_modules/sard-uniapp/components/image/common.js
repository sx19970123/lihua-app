import { defaultConfig } from '../config';
export const defaultImageProps = defaultConfig.image;
export const FIX_MODES = {
    widthFix: true,
    heightFix: true,
};
export const IMAGE_MODES = {
    aspectFit: ['center', 'contain'],
    aspectFill: ['center', 'cover'],
    scaleToFill: ['center', '100% 100%'],
    widthFix: [undefined, '100% 100%'],
    heightFix: [undefined, '100% 100%'],
    top: ['center top', 'auto'],
    bottom: ['center bottom', 'auto'],
    left: ['left center', 'auto'],
    right: ['right center', 'auto'],
    center: ['center', 'auto'],
    'top left': ['left top', 'auto'],
    'top right': ['right top', 'auto'],
    'bottom left': ['left bottom', 'auto'],
    'bottom right': ['right bottom', 'auto'],
};
