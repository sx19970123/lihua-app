import { type DropdownProps, type DropdownSlots } from './common';
declare function __VLS_template(): Readonly<DropdownSlots> & DropdownSlots;
declare const __VLS_component: import("vue").DefineComponent<DropdownProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DropdownProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    valueOnClear: () => any;
    duration: number;
    direction: "down" | "up";
    disabled: boolean;
    overlayClosable: boolean;
    awayClosable: boolean;
    togglable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
