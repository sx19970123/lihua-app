import { type AvatarGroupProps, type AvatarGroupSlots } from './common';
declare function __VLS_template(): Readonly<AvatarGroupSlots> & AvatarGroupSlots;
declare const __VLS_component: import("vue").DefineComponent<AvatarGroupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "remain-click": (event: any) => any;
}, string, import("vue").PublicProps, Readonly<AvatarGroupProps> & Readonly<{
    "onRemain-click"?: ((event: any) => any) | undefined;
}>, {
    max: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    total: number;
    coverage: number;
    showRemain: boolean;
    remainText: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
