import { computed, getCurrentInstance, onBeforeUnmount, onMounted, unref, watch, } from 'vue';
export function useIntersectionObserver(callback, options = {}) {
    const instance = getCurrentInstance();
    let observer = null;
    const selector = computed(() => unref(options.selector));
    const root = computed(() => unref(options.root));
    const offsetTop = computed(() => -(unref(options.offsetTop) || 0));
    const offsetBottom = computed(() => -(unref(options.offsetBottom) || 0));
    const createObserver = () => {
        if (!selector.value) {
            return;
        }
        observer = uni.createIntersectionObserver(options.instance?.proxy || instance?.proxy, {
            thresholds: options.thresholds,
            initialRatio: options.initialRatio,
            observeAll: options.observeAll,
        });
        if (root.value) {
            observer?.relativeTo(root.value, {
                top: offsetTop.value,
                bottom: offsetBottom.value,
            });
        }
        else {
            observer?.relativeToViewport({
                top: offsetTop.value,
                bottom: offsetBottom.value,
            });
        }
        observer?.observe(selector.value, callback);
    };
    watch([selector, root, offsetTop, offsetBottom], () => {
        recreate();
    });
    const disconnect = () => {
        observer?.disconnect();
    };
    const recreate = () => {
        disconnect();
        createObserver();
    };
    onMounted(() => {
        createObserver();
    });
    onBeforeUnmount(() => {
        disconnect();
    });
    return {
        recreate,
        disconnect,
    };
}
