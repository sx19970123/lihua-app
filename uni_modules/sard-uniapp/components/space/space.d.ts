import { type SpaceProps, type SpaceSlots } from './common';
declare function __VLS_template(): Readonly<SpaceSlots> & SpaceSlots;
declare const __VLS_component: import("vue").DefineComponent<SpaceProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SpaceProps> & Readonly<{}>, {
    size: import("./common").SpaceSize | (string & {});
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    direction: "vertical" | "horizontal";
    wrap: boolean;
    align: import("./common").SpaceAlign | (string & {});
    justify: import("./common").SpaceJustify | (string & {});
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
