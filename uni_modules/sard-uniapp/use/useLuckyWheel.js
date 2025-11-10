import { computed, unref } from 'vue';
import { useLuckyDraw } from './useLuckyDraw';
const defaultOptions = {
    count: 8,
    minSpeed: 0.01,
    endDelay: 300,
};
export function useLuckyWheel(options) {
    const { count, ...restOptions } = Object.assign({}, defaultOptions, options);
    const { activeIndex, ...restResult } = useLuckyDraw({
        ...restOptions,
        count,
    });
    return {
        ...restResult,
        degrees: computed(() => {
            return unref(count) === 0
                ? 0
                : ((activeIndex.value || 0) / unref(count)) * 360;
        }),
        sectorDegrees: computed(() => {
            return unref(count) === 0 ? 0 : 360 / unref(count);
        }),
    };
}
