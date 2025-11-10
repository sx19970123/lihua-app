import { type LoadMoreProps, type LoadMoreSlots } from './common';
declare function __VLS_template(): Readonly<LoadMoreSlots> & LoadMoreSlots;
declare const __VLS_component: import("vue").DefineComponent<LoadMoreProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "load-more": () => any;
    reload: () => any;
}, string, import("vue").PublicProps, Readonly<LoadMoreProps> & Readonly<{
    "onLoad-more"?: (() => any) | undefined;
    onReload?: (() => any) | undefined;
}>, {
    status: import("./common").LoadMoreStatus;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
