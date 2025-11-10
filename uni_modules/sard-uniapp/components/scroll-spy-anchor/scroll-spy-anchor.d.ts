import { type ScrollSpyAnchorProps, type ScrollSpyAnchorSlots } from './common';
declare function __VLS_template(): Readonly<ScrollSpyAnchorSlots> & ScrollSpyAnchorSlots;
declare const __VLS_component: import("vue").DefineComponent<ScrollSpyAnchorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ScrollSpyAnchorProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
