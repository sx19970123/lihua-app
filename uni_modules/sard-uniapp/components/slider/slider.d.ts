import { type SliderProps, type SliderSlots } from './common';
declare function __VLS_template(): Readonly<SliderSlots> & SliderSlots;
declare const __VLS_component: import("vue").DefineComponent<SliderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: number | number[]) => any;
    change: (value: number | number[]) => any;
    input: (value: number | number[]) => any;
    "drag-start": (event: TouchEvent) => any;
    "drag-end": (event: TouchEvent) => any;
}, string, import("vue").PublicProps, Readonly<SliderProps> & Readonly<{
    "onUpdate:model-value"?: ((value: number | number[]) => any) | undefined;
    onChange?: ((value: number | number[]) => any) | undefined;
    onInput?: ((value: number | number[]) => any) | undefined;
    "onDrag-start"?: ((event: TouchEvent) => any) | undefined;
    "onDrag-end"?: ((event: TouchEvent) => any) | undefined;
}>, {
    min: number;
    max: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: number | number[];
    vertical: boolean;
    disabled: boolean;
    readonly: boolean;
    range: boolean;
    validateEvent: boolean;
    trackColor: string;
    step: number;
    pieceColor: string;
    trackSize: string;
    thumbColor: string;
    thumbSize: string;
    showValue: boolean;
    valuePosition: "top" | "right" | "bottom" | "left";
    valueBackground: string;
    valueColor: string;
    showScale: boolean;
    scalePosition: "top" | "right" | "bottom" | "left";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
