import { type AvatarProps, type AvatarSlots } from './common';
declare function __VLS_template(): Readonly<AvatarSlots> & AvatarSlots;
declare const __VLS_component: import("vue").DefineComponent<AvatarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: any) => any;
}, string, import("vue").PublicProps, Readonly<AvatarProps> & Readonly<{
    onClick?: ((event: any) => any) | undefined;
}>, {
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    background: string;
    color: string;
    shape: "circle" | "square";
    iconSize: string;
    src: string;
    index: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
