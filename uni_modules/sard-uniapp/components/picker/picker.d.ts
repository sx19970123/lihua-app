import { type PickerProps, type PickerSlots, type PickerOption } from './common';
declare function __VLS_template(): Readonly<PickerSlots> & PickerSlots;
declare const __VLS_component: import("vue").DefineComponent<PickerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: any, selectedOptions: PickerOption[], indexes: number[]) => any;
    change: (value: any, selectedOptions: PickerOption[], indexes: number[]) => any;
}, string, import("vue").PublicProps, Readonly<PickerProps> & Readonly<{
    "onUpdate:model-value"?: ((value: any, selectedOptions: PickerOption[], indexes: number[]) => any) | undefined;
    onChange?: ((value: any, selectedOptions: PickerOption[], indexes: number[]) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    columns: PickerOption[] | PickerOption[][];
    optionKeys: import("./common").PickerOptionKeys;
    immediateChange: boolean;
    internalCustom: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
