import { type ToastAgentProps } from './common';
import { type TransitionHookName } from '../../use';
declare const _default: import("vue").DefineComponent<ToastAgentProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ToastAgentProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    timeout: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "text" | "loading" | "success" | "fail";
    title: string | number;
    visible: boolean;
    id: string;
    overlay: boolean;
    duration: number;
    transparent: boolean;
    onVisibleHook: (name: TransitionHookName) => void;
    onBeforeEnter: () => void;
    onEnter: () => void;
    onAfterEnter: () => void;
    onEnterCancelled: () => void;
    onBeforeLeave: () => void;
    onLeave: () => void;
    onAfterLeave: () => void;
    onLeaveCancelled: () => void;
    position: "top" | "center" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
