import { type CheckboxProps, type CheckboxSlots } from './common';
declare function __VLS_template(): Readonly<CheckboxSlots> & CheckboxSlots;
declare const __VLS_component: import("vue").DefineComponent<CheckboxProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
    change: (checked: boolean) => any;
    "update:checked": (checked: boolean) => any;
}, string, import("vue").PublicProps, Readonly<CheckboxProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
    onChange?: ((checked: boolean) => any) | undefined;
    "onUpdate:checked"?: ((checked: boolean) => any) | undefined;
}>, {
    value: any;
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: import("./common").IconType;
    label: string;
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    checked: boolean;
    indeterminate: boolean;
    checkedColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
