import { inject, ref, provide, watch, reactive } from 'vue';
import { defaultConfig } from '../config';
export const defaultPopupProps = defaultConfig.popup;
export const popupContextSymbol = Symbol('popup-context');
export function usePopupVisibleHookProvide() {
    const visibleState = ref();
    provide(popupContextSymbol, reactive({
        visibleState,
    }));
    function callVisibleHook(name) {
        visibleState.value = name;
    }
    return callVisibleHook;
}
export function usePopupEnter(callback) {
    const context = inject(popupContextSymbol, null);
    if (context) {
        watch(() => context.visibleState, () => {
            if (context.visibleState === 'enter') {
                callback?.();
            }
        });
    }
}
export function useInPopup() {
    return !!inject(popupContextSymbol, null);
}
