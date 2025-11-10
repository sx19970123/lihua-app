import { type SegmentedProps, type SegmentedSlots } from './common';
declare function __VLS_template(): Readonly<SegmentedSlots> & SegmentedSlots;
declare const __VLS_component: import("vue").DefineComponent<SegmentedProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: any) => any;
    change: (value: any) => any;
}, string, import("vue").PublicProps, Readonly<SegmentedProps> & Readonly<{
    "onUpdate:model-value"?: ((value: any) => any) | undefined;
    onChange?: ((value: any) => any) | undefined;
}>, {
    size: import("./common").SegmentedSize;
    options: import("./common").SegmentedOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    direction: "horizontal" | "vertical";
    disabled: boolean;
    readonly: boolean;
    shape: "square" | "round";
    validateEvent: boolean;
    optionKeys: import("./common").SegmentedOptionKeys;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
