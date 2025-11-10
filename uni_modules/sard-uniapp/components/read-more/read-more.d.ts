import { type ReadMoreProps, type ReadMoreSlots } from './common';
declare function __VLS_template(): Readonly<ReadMoreSlots> & ReadMoreSlots;
declare const __VLS_component: import("vue").DefineComponent<ReadMoreProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    close: () => any;
    "update:visible": (visible: boolean) => any;
    open: () => any;
}, string, import("vue").PublicProps, Readonly<ReadMoreProps> & Readonly<{
    onClose?: (() => any) | undefined;
    "onUpdate:visible"?: ((visible: boolean) => any) | undefined;
    onOpen?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    visible: boolean;
    maxHeight: number;
    hideClose: boolean;
    openText: string;
    closeText: string;
    keepLocation: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
