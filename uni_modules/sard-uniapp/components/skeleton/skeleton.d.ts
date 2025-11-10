import { type SkeletonProps, type SkeletonSlots } from './common';
declare function __VLS_template(): Readonly<SkeletonSlots> & SkeletonSlots;
declare const __VLS_component: import("vue").DefineComponent<SkeletonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SkeletonProps> & Readonly<{}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: boolean;
    avatar: boolean;
    loading: boolean;
    round: boolean;
    animated: boolean;
    rows: number;
    avatarSize: string;
    avatarRound: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
