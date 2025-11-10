import { type GridProps, type GridSlots } from './common';
declare function __VLS_template(): Readonly<GridSlots> & GridSlots;
declare const __VLS_component: import("vue").DefineComponent<GridProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<GridProps> & Readonly<{}>, {
    reverse: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    columns: number;
    direction: "horizontal" | "vertical";
    square: boolean;
    gap: string;
    bordered: boolean;
    clickable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
