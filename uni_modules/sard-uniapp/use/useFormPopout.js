import { ref, watch } from 'vue';
import { useTwoWayVisible } from './useTwoWayVisible';
import { useFormItemContext } from '../components/form';
export function useFormPopout(props, emit, options = {}) {
    // visible
    const { visible } = useTwoWayVisible(props, emit);
    // value
    const formItemContext = useFormItemContext();
    const innerValue = ref(props.modelValue);
    watch(() => props.modelValue, () => {
        innerValue.value = props.modelValue;
        if (props.validateEvent) {
            formItemContext?.onChange();
        }
    });
    const popoutValue = ref(props.modelValue);
    watch(innerValue, () => {
        popoutValue.value = innerValue.value;
    });
    let restArgs = [];
    const onChange = (value, ...args) => {
        popoutValue.value = value;
        restArgs = args;
        options.onChange?.(value, ...args);
    };
    const onConfirm = (showConfirm = true) => {
        if (showConfirm) {
            emit('confirm');
        }
        const extraArgs = options.onConfirmBefore?.();
        if (extraArgs) {
            restArgs = extraArgs;
        }
        if (popoutValue.value !== innerValue.value) {
            innerValue.value = popoutValue.value;
            const args = [innerValue.value, ...restArgs];
            emit('update:model-value', ...args);
            emit('change', ...args);
        }
    };
    const onVisibleHook = (name) => {
        if (props.resettable &&
            name === 'after-leave' &&
            popoutValue.value !== innerValue.value) {
            popoutValue.value = innerValue.value;
        }
        emit('visible-hook', name);
        emit(name);
    };
    return {
        innerVisible: visible,
        innerValue,
        popoutValue,
        onChange,
        onConfirm,
        onVisibleHook,
    };
}
