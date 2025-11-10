import { type SwipeActionProps, type SwipeActionSlots, type SwipeActionVisible } from './common';
declare function __VLS_template(): Readonly<SwipeActionSlots> & SwipeActionSlots;
declare const __VLS_component: import("vue").DefineComponent<SwipeActionProps, {
    hide: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:visible": (value: SwipeActionVisible) => any;
}, string, import("vue").PublicProps, Readonly<SwipeActionProps> & Readonly<{
    "onUpdate:visible"?: ((value: SwipeActionVisible) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
