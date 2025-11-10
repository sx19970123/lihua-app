import { type StepperProps } from './common';
declare const _default: import("vue").DefineComponent<StepperProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string | number | undefined) => any;
    blur: (event: any) => any;
    change: (value: string | number | undefined) => any;
    focus: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<StepperProps> & Readonly<{
    "onUpdate:model-value"?: ((value: string | number | undefined) => any) | undefined;
    onBlur?: ((event: any) => any) | undefined;
    onChange?: ((value: string | number | undefined) => any) | undefined;
    onFocus?: ((event: any) => any) | undefined;
}>, {
    min: number;
    max: number;
    size: "small" | "medium";
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: number | string | null;
    valueOnClear: number | "min" | "max";
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    placeholder: string;
    precision: number;
    step: number;
    inputStyle: string;
    inputType: "number" | "digit" | "text";
    press: boolean;
    pressTime: number;
    interval: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
