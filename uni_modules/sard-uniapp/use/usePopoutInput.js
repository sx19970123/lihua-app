import { ref, watch } from 'vue';
import { useTwoWayVisible } from './useTwoWayVisible';
import { defaultConfig } from '../components/config';
const defaultValueOnClear = () => undefined;
export function usePopoutInput(props, emit, options = {}) {
    // visible
    const { visible } = useTwoWayVisible(props, emit);
    const show = () => {
        visible.value = true;
    };
    const onVisibleHook = (name) => {
        emit('visible-hook', name);
        emit(name);
    };
    // value
    const innerValue = ref(props.modelValue);
    const getValueOnClear = () => (props.valueOnClear || defaultConfig.valueOnClear || defaultValueOnClear)();
    watch(() => props.modelValue, () => {
        innerValue.value = props.modelValue;
    });
    const onChange = (...args) => {
        emit('update:model-value', ...args);
        emit('change', ...args);
    };
    const onClear = () => {
        inputValue.value = '';
        innerValue.value = getValueOnClear();
        if (options.onClear) {
            options.onClear(innerValue.value);
        }
        else {
            emit('update:model-value', innerValue.value);
            emit('change', innerValue.value);
        }
    };
    // input
    const inputValue = ref('');
    return {
        innerVisible: visible,
        innerValue,
        inputValue,
        show,
        onChange,
        onClear,
        onVisibleHook,
    };
}
