import { type PullDownRefreshProps, type PullDownRefreshSlots, type PullDownRefreshEmits, type PullDownRefreshStatus } from './common';
declare function __VLS_template(): Readonly<PullDownRefreshSlots> & PullDownRefreshSlots;
declare const __VLS_component: import("vue").DefineComponent<PullDownRefreshProps, {
    enableToRefresh: (canRefresh: boolean) => void;
    _setStatus: (status: PullDownRefreshStatus) => void;
    _emit: (event: {
        name: Parameters<PullDownRefreshEmits>[0];
        payload?: any;
    }) => void;
    _toRecovering: () => void;
    _toLoading: () => void;
    _setTranslateY: (y: number) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    refresh: () => any;
}, string, import("vue").PublicProps, Readonly<PullDownRefreshProps> & Readonly<{
    onRefresh?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    loading: boolean;
    disabled: boolean;
    threshold: number;
    headerHeight: number;
    transitionDuration: number;
    doneDuration: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
