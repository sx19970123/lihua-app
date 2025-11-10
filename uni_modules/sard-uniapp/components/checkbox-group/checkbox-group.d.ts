import { type CheckboxGroupProps, type CheckboxGroupSlots } from '../checkbox/common';
declare function __VLS_template(): Readonly<CheckboxGroupSlots> & CheckboxGroupSlots;
declare const __VLS_component: import("vue").DefineComponent<CheckboxGroupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: any[]) => any;
    click: (event: any) => any;
    change: (value: any[]) => any;
}, string, import("vue").PublicProps, Readonly<CheckboxGroupProps> & Readonly<{
    "onUpdate:model-value"?: ((value: any[]) => any) | undefined;
    onClick?: ((event: any) => any) | undefined;
    onChange?: ((value: any[]) => any) | undefined;
}>, {
    size: string;
    options: import("../checkbox/common").CheckboxGroupOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any[];
    type: import("../checkbox/common").IconType;
    direction: "horizontal" | "vertical";
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    checkedColor: string;
    optionKeys: import("../checkbox/common").CheckboxGroupOptionKeys;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
