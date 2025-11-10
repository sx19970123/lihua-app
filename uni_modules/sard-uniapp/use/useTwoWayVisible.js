import { ref, watch } from 'vue';
export function useTwoWayVisible(props, emit) {
    const visible = ref(props.visible);
    watch(() => props.visible, () => {
        visible.value = props.visible;
    });
    watch(visible, () => {
        emit('update:visible', !!visible.value);
    });
    return {
        visible,
    };
}
