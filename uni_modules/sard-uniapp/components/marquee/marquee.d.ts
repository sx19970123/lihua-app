import { type MarqueeProps, type MarqueeSlots } from './common';
declare function __VLS_template(): Readonly<MarqueeSlots> & MarqueeSlots;
declare const __VLS_component: import("vue").DefineComponent<MarqueeProps, {
    update: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<MarqueeProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    direction: "vertical" | "horizontal";
    delay: number;
    speed: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
