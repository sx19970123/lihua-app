import { type RadioGroupProps, type RadioGroupSlots } from '../radio/common';
declare function __VLS_template(): Readonly<RadioGroupSlots> & RadioGroupSlots;
declare const __VLS_component: import("vue").DefineComponent<RadioGroupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: any) => any;
    change: (value: any) => any;
}, string, import("vue").PublicProps, Readonly<RadioGroupProps> & Readonly<{
    "onUpdate:model-value"?: ((value: any) => any) | undefined;
    onChange?: ((value: any) => any) | undefined;
}>, {
    size: string;
    options: import("../radio/common").RadioGroupOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    type: import("../radio/common").IconType;
    direction: "horizontal" | "vertical";
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    checkedColor: string;
    optionKeys: import("../radio/common").RadioGroupOptionKeys;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
