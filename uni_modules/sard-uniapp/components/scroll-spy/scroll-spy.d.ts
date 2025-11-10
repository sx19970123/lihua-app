import { type ScrollSpyProps, type ScrollSpySlots } from './common';
declare function __VLS_template(): Readonly<ScrollSpySlots> & ScrollSpySlots;
declare const __VLS_component: import("vue").DefineComponent<ScrollSpyProps, {
    scrollTo: (name: string | number) => void;
    update: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (name: string | number) => any;
    scroll: (event: any) => any;
    "update:current": (name: string | number) => any;
    scrolltoupper: () => any;
    scrolltolower: () => any;
}, string, import("vue").PublicProps, Readonly<ScrollSpyProps> & Readonly<{
    onChange?: ((name: string | number) => any) | undefined;
    onScroll?: ((event: any) => any) | undefined;
    "onUpdate:current"?: ((name: string | number) => any) | undefined;
    onScrolltoupper?: (() => any) | undefined;
    onScrolltolower?: (() => any) | undefined;
}>, {
    upperThreshold: number | string;
    lowerThreshold: number | string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
