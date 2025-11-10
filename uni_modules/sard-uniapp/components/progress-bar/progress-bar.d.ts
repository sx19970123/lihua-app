import { type ProgressBarProps, type ProgressBarSlots } from './common';
declare function __VLS_template(): Readonly<ProgressBarSlots> & ProgressBarSlots;
declare const __VLS_component: import("vue").DefineComponent<ProgressBarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProgressBarProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    status: "success" | "warning" | "error";
    color: string;
    animated: boolean;
    percent: number;
    inside: boolean;
    trackColor: string;
    thickness: string;
    showText: boolean;
    striped: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
