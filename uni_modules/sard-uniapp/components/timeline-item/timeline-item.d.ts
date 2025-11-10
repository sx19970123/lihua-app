import { type TimelineItemProps, type TimelineItemSlots } from '../timeline/common';
declare function __VLS_template(): Readonly<TimelineItemSlots> & TimelineItemSlots;
declare const __VLS_component: import("vue").DefineComponent<TimelineItemProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<TimelineItemProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
