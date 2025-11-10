import { getCurrentInstance, onMounted } from 'vue';
import { getBoundingClientRect } from '../../utils';
export function usePopover(selector) {
    const instance = getCurrentInstance();
    let context;
    let customGetRect;
    function _inject(value) {
        context = value;
    }
    function getRect() {
        if (customGetRect) {
            const tempGetRect = customGetRect;
            customGetRect = undefined;
            return tempGetRect();
        }
        if (selector) {
            return getBoundingClientRect(selector, instance);
        }
    }
    onMounted(() => {
        context?.register({
            getRect,
        });
    });
    const show = (getRectFn) => {
        customGetRect = getRectFn;
        if (selector || customGetRect) {
            context?.show();
        }
    };
    return {
        show,
        _inject,
    };
}
