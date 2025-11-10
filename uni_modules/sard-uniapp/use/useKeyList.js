import { computed, reactive, unref } from 'vue';
import { uniqid } from '../utils';
export function useKeyList(list) {
    const keyMap = new WeakMap();
    return computed(() => {
        return unref(list).map((item) => {
            const key = keyMap.get(item) || uniqid();
            keyMap.set(item, key);
            return reactive({
                data: item,
                key,
            });
        });
    });
}
