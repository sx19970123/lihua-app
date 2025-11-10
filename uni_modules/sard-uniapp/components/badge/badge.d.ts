import { type BadgeProps, type BadgeSlots } from './common';
declare function __VLS_template(): Readonly<BadgeSlots> & BadgeSlots;
declare const __VLS_component: import("vue").DefineComponent<BadgeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BadgeProps> & Readonly<{}>, {
    max: number;
    value: number | string;
    fixed: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    color: string;
    showZero: boolean;
    textColor: string;
    dot: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
