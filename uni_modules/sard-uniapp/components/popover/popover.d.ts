import { type MenuOption } from '../menu/common';
import { type PopoverProps, type PopoverSlots } from './common';
declare function __VLS_template(): Readonly<PopoverSlots> & PopoverSlots;
declare const __VLS_component: import("vue").DefineComponent<PopoverProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    select: (option: MenuOption) => any;
    "update:visible": (visible: boolean) => any;
}, string, import("vue").PublicProps, Readonly<PopoverProps> & Readonly<{
    onSelect?: ((option: MenuOption) => any) | undefined;
    "onUpdate:visible"?: ((visible: boolean) => any) | undefined;
}>, {
    options: MenuOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    visible: boolean;
    duration: number;
    direction: "vertical" | "horizontal";
    transparent: boolean;
    theme: "dark" | "light";
    position: import("./utils").Position;
    refGap: number;
    viewportGap: number;
    controller: import("./usePopover").PopoverController;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
