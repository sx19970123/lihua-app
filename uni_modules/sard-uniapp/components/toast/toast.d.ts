import { type ToastProps } from './common';
declare const _default: import("vue").DefineComponent<ToastProps, {
    reHideLater: () => void;
    cancelHide: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ToastProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    timeout: number;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    type: "text" | "loading" | "success" | "fail";
    title: string | number;
    visible: boolean;
    overlay: boolean;
    duration: number;
    transparent: boolean;
    position: "top" | "center" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
export declare const mapIdToast: Record<string, {
    show(props: Record<string, any>): void;
    hide(): void;
}>;
