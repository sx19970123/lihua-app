import { type ListItemProps, type ListItemSlots } from '../list/common';
declare function __VLS_template(): Readonly<ListItemSlots> & ListItemSlots;
declare const __VLS_component: import("vue").DefineComponent<ListItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<ListItemProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {
    value: string | number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: string | number;
    description: string | number;
    icon: string;
    iconSize: string;
    iconFamily: string;
    arrow: boolean;
    hover: boolean;
    arrowDirection: "up" | "right" | "down";
    iconColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
