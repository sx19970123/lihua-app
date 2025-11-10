import { type CountDownProps, type CountDownSlots, type CountDownCurrentTime } from './common';
declare function __VLS_template(): Readonly<CountDownSlots> & CountDownSlots;
declare const __VLS_component: import("vue").DefineComponent<CountDownProps, {
    start: () => void;
    pause: () => void;
    reset: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    change: (time: CountDownCurrentTime) => any;
    finish: () => any;
}, string, import("vue").PublicProps, Readonly<CountDownProps> & Readonly<{
    onChange?: ((time: CountDownCurrentTime) => any) | undefined;
    onFinish?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    time: number;
    autoStart: boolean;
    format: string;
    millisecond: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
