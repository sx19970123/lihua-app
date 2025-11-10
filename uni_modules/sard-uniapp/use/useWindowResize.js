import { onBeforeUnmount, onMounted } from 'vue';
export function useWindowResize(callback) {
    const cb = (res) => {
        callback({
            windowWidth: res.size.windowWidth,
            windowHeight: res.size.windowHeight,
        });
    };
    onMounted(() => {
        uni.onWindowResize?.(cb);
    });
    onBeforeUnmount(() => {
        uni.offWindowResize?.(cb);
    });
}
