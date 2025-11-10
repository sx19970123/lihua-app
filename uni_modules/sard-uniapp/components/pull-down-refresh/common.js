import { defaultConfig } from '../config';
export const defaultPullDownRefreshProps = () => ({
    ...defaultConfig.pullDownRefresh,
    loading: false,
    disabled: false,
});
export const pullDownRefreshProps = {
    rootStyle: [String, Object, Array],
    rootClass: String,
    threshold: {
        type: Number,
        default: defaultConfig.pullDownRefresh.threshold,
    },
    headerHeight: {
        type: Number,
        default: defaultConfig.pullDownRefresh.headerHeight,
    },
    loading: {
        type: Boolean,
        default: false,
    },
    transitionDuration: {
        type: Number,
        default: defaultConfig.pullDownRefresh.transitionDuration,
    },
    doneDuration: {
        type: Number,
        default: defaultConfig.pullDownRefresh.doneDuration,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
};
