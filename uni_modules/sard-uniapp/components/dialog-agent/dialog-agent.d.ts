import { type DialogAgentProps } from './common';
import { type TransitionHookName } from '../../use';
declare const _default: import("vue").DefineComponent<DialogAgentProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<DialogAgentProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    title: string;
    visible: boolean;
    id: string;
    duration: number;
    message: string;
    overlayClosable: boolean;
    beforeClose: import("../dialog/common.js").DialogBeforeClose;
    showConfirm: boolean;
    cancelText: string;
    confirmText: string;
    popupStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    popupClass: string;
    headed: boolean;
    buttonType: "round" | "text";
    showCancel: boolean;
    cancelProps: import("../button/common.js").ButtonProps;
    confirmProps: import("../button/common.js").ButtonProps;
    onClose: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    onVisibleHook: (name: TransitionHookName) => void;
    onBeforeEnter: () => void;
    onEnter: () => void;
    onAfterEnter: () => void;
    onEnterCancelled: () => void;
    onBeforeLeave: () => void;
    onLeave: () => void;
    onAfterLeave: () => void;
    onLeaveCancelled: () => void;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
