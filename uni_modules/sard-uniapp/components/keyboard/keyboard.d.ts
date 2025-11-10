import { type KeyboardProps, type KeyboardSlots, type KeyboardPlateMode } from './common';
declare function __VLS_template(): Readonly<KeyboardSlots> & KeyboardSlots;
declare const __VLS_component: import("vue").DefineComponent<KeyboardProps, {
    shuffle: () => void;
    toggle: (mode?: KeyboardPlateMode) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    delete: () => any;
    input: (key: string) => any;
    toggle: (mode: KeyboardPlateMode) => any;
    "update:mode": (mode: KeyboardPlateMode) => any;
}, string, import("vue").PublicProps, Readonly<KeyboardProps> & Readonly<{
    onDelete?: (() => any) | undefined;
    onInput?: ((key: string) => any) | undefined;
    onToggle?: ((mode: KeyboardPlateMode) => any) | undefined;
    "onUpdate:mode"?: ((mode: KeyboardPlateMode) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "number" | "digit" | "idcard" | "random" | "plate";
    mode: KeyboardPlateMode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
