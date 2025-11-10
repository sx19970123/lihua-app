import { type SignatureProps, type SignatureSlots } from './common';
declare function __VLS_template(): Readonly<SignatureSlots> & SignatureSlots;
declare const __VLS_component: import("vue").DefineComponent<SignatureProps, {
    resize: () => void;
    clear: () => void;
    confirm: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    clear: () => any;
    "update:visible": (visible: boolean) => any;
    confirm: (dataURL: string) => any;
}, string, import("vue").PublicProps, Readonly<SignatureProps> & Readonly<{
    onCancel?: (() => any) | undefined;
    onClear?: (() => any) | undefined;
    "onUpdate:visible"?: ((visible: boolean) => any) | undefined;
    onConfirm?: ((dataURL: string) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "png" | "jpg";
    visible: boolean;
    duration: number;
    background: string;
    color: string;
    quality: number;
    cancelText: string;
    confirmText: string;
    lineWidth: number;
    fullScreen: boolean;
    clearText: string;
    customNavbar: boolean;
    target: "dataURL" | "filePath";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
