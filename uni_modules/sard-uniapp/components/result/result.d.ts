import { type ResultProps, type ResultSlots } from './common';
declare function __VLS_template(): Readonly<ResultSlots> & ResultSlots;
declare const __VLS_component: import("vue").DefineComponent<ResultProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ResultProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: string;
    description: string;
    icon: string;
    status: "success" | "info" | "warning" | "error" | "question";
    iconFamily: string;
    iconColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
