import { type PasswordInputProps } from './common';
declare const _default: import("vue").DefineComponent<PasswordInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string) => any;
    change: (value: string) => any;
    "updat:focused": (focused: boolean) => any;
}, string, import("vue").PublicProps, Readonly<PasswordInputProps> & Readonly<{
    "onUpdate:model-value"?: ((value: string) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    "onUpdat:focused"?: ((focused: boolean) => any) | undefined;
}>, {
    length: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: string;
    type: "border" | "underline";
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    focused: boolean;
    gap: number | string;
    plainText: boolean;
    customKeyboard: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
