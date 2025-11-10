import { type RateProps } from './common';
declare const _default: import("vue").DefineComponent<RateProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: number) => any;
    change: (value: number) => any;
}, string, import("vue").PublicProps, Readonly<RateProps> & Readonly<{
    "onUpdate:model-value"?: ((value: number) => any) | undefined;
    onChange?: ((value: number) => any) | undefined;
}>, {
    text: string;
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: number;
    icon: string;
    count: number;
    disabled: boolean;
    readonly: boolean;
    color: string;
    iconFamily: string;
    validateEvent: boolean;
    clearable: boolean;
    gap: string;
    allowHalf: boolean;
    voidIcon: string;
    voidText: string;
    voidColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
