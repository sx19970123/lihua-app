import { type NotifyAgentProps } from './common';
import { type TransitionHookName } from '../../use';
declare const _default: import("vue").DefineComponent<NotifyAgentProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<NotifyAgentProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    timeout: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "primary" | "success" | "warning" | "error";
    visible: boolean;
    id: string;
    statusBar: boolean;
    duration: number;
    message: string;
    background: string;
    color: string;
    onVisibleHook: (name: TransitionHookName) => void;
    onBeforeEnter: () => void;
    onEnter: () => void;
    onAfterEnter: () => void;
    onEnterCancelled: () => void;
    onBeforeLeave: () => void;
    onLeave: () => void;
    onAfterLeave: () => void;
    onLeaveCancelled: () => void;
    position: "top" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
