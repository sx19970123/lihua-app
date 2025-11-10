import { type InputProps, type InputSlots } from './common';
declare function __VLS_template(): Readonly<InputSlots> & InputSlots;
declare const __VLS_component: import("vue").DefineComponent<InputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<InputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    fixed: boolean;
    focus: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: string | number;
    borderless: boolean;
    type: "text" | "number" | "idcard" | "digit" | "tel" | "safe-password" | "nickname" | "password" | "textarea";
    disabled: boolean;
    readonly: boolean;
    inlaid: boolean;
    validateEvent: boolean;
    enableNative: boolean;
    placeholder: string;
    placeholderStyle: string;
    placeholderClass: string;
    maxlength: number;
    cursorSpacing: number;
    cursor: number;
    confirmType: "send" | "search" | "next" | "go" | "done";
    confirmHold: boolean;
    selectionStart: number;
    selectionEnd: number;
    adjustPosition: boolean;
    holdKeyboard: boolean;
    autoBlur: boolean;
    ignoreCompositionEvent: boolean;
    inputmode: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    autoHeight: boolean;
    showConfirmBar: boolean;
    disableDefaultPadding: boolean;
    inputMinHeight: boolean;
    alwaysEmbed: boolean;
    safePasswordCertPath: string;
    safePasswordLength: string;
    safePasswordTimeStamp: string;
    safePasswordNonce: string;
    safePasswordSalt: string;
    safePasswordCustomHash: string;
    randomNumber: boolean;
    controlled: boolean;
    alwaysSystem: boolean;
    clearable: boolean;
    showClearOnlyFocus: boolean;
    showCount: boolean;
    focused: boolean;
    minHeight: string;
    showEye: boolean;
    internalPrepend: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
