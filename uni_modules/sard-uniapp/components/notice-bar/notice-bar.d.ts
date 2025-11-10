import { type NoticeBarProps, type NoticeBarSlots } from './common';
declare function __VLS_template(): Readonly<NoticeBarSlots> & NoticeBarSlots;
declare const __VLS_component: import("vue").DefineComponent<NoticeBarProps, {
    update: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<NoticeBarProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
    onClose?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    visible: boolean;
    vertical: boolean;
    background: string;
    closable: boolean;
    color: string;
    delay: number;
    speed: number;
    hideLeftIcon: boolean;
    scrollable: "auto" | "never" | "always";
    wrap: boolean;
    linkable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
