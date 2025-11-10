import { onUnmounted, shallowReadonly, shallowRef, toValue, } from 'vue';
export function useTimeout(cb, interval, options = {}) {
    const { immediate = false, immediateCallback = false } = options;
    const isPending = shallowRef(false);
    let timer = null;
    function clear() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }
    function stop() {
        isPending.value = false;
        clear();
    }
    function start(...args) {
        if (immediateCallback)
            cb();
        clear();
        isPending.value = true;
        timer = setTimeout(() => {
            isPending.value = false;
            timer = null;
            cb(...args);
        }, toValue(interval));
    }
    if (immediate) {
        start();
    }
    onUnmounted(() => {
        stop();
    });
    return {
        isPending: shallowReadonly(isPending),
        start,
        stop,
    };
}
export const useSetTimeout = useTimeout;
