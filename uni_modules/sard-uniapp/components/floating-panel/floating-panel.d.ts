import { type FloatingPanelProps, type FloatingPanelSlots } from './common';
declare function __VLS_template(): Readonly<FloatingPanelSlots> & FloatingPanelSlots;
declare const __VLS_component: import("vue").DefineComponent<FloatingPanelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:height": (value: number) => any;
    "height-change": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<FloatingPanelProps> & Readonly<{
    "onUpdate:height"?: ((value: number) => any) | undefined;
    "onHeight-change"?: ((value: number) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    height: number;
    duration: number;
    anchors: number[];
    contentDraggable: boolean;
    safeAreaInsetBottom: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
