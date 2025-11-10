import { type TableProps, type TableSlots } from './common';
declare function __VLS_template(): Readonly<TableSlots> & TableSlots;
declare const __VLS_component: import("vue").DefineComponent<TableProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<TableProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    height: string;
    bordered: boolean;
    underline: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
