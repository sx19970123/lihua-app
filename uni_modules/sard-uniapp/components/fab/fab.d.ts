import { type FabProps, type FabSlots, type FabItem } from './common';
declare function __VLS_template(): Readonly<FabSlots> & FabSlots;
declare const __VLS_component: import("vue").DefineComponent<FabProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
    select: (item: FabItem, index: number) => any;
    "update:offset": (offset: {
        x: number;
        y: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<FabProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
    onSelect?: ((item: FabItem, index: number) => any) | undefined;
    "onUpdate:offset"?: ((offset: {
        x: number;
        y: number;
    }) => any) | undefined;
}>, {
    offset: {
        x: number;
        y: number;
    };
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    icon: string;
    duration: number;
    left: string;
    right: string;
    background: string;
    overlayClosable: boolean;
    itemList: FabItem[];
    color: string;
    bottom: string;
    iconFamily: string;
    top: string;
    visibleIcon: string;
    hideName: boolean;
    draggable: boolean;
    axis: "x" | "y" | "both" | "none";
    magnet: "x" | "y";
    gapX: number;
    gapY: number;
    navbarHeight: number;
    tabbarHeight: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
