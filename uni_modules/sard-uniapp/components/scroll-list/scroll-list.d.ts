import { type ScrollListProps, type ScrollListSlots } from './common';
declare function __VLS_template(): Readonly<ScrollListSlots> & ScrollListSlots;
declare const __VLS_component: import("vue").DefineComponent<ScrollListProps, {
    update: () => Promise<void>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    scroll: (event: any) => any;
    scrolltoupper: (event: any) => any;
    scrolltolower: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<ScrollListProps> & Readonly<{
    onScroll?: ((event: any) => any) | undefined;
    onScrolltoupper?: ((event: any) => any) | undefined;
    onScrolltolower?: ((event: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
