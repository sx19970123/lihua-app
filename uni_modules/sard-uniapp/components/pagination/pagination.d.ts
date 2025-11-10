import { type PaginationProps, type PaginationSlots } from './common';
declare function __VLS_template(): Readonly<PaginationSlots> & PaginationSlots;
declare const __VLS_component: import("vue").DefineComponent<PaginationProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (page: number) => any;
    "update:current": (page: number) => any;
}, string, import("vue").PublicProps, Readonly<PaginationProps> & Readonly<{
    onChange?: ((page: number) => any) | undefined;
    "onUpdate:current"?: ((page: number) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "simple" | "multi";
    total: number;
    pageSize: number;
    current: number;
    pageCount: number;
    pageButtonCount: number;
    hideOnSinglePage: boolean;
    ellipsis: boolean;
    multiCount: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
