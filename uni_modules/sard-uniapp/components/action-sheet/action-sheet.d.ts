import { type ActionSheetItem, type ActionSheetProps } from './common';
declare const _default: import("vue").DefineComponent<ActionSheetProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<ActionSheetProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    cancel: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    description: string;
    visible: boolean;
    duration: number;
    overlayClosable: boolean;
    itemList: ActionSheetItem[];
    beforeClose: (type: "close" | "cancel" | "select") => boolean | Promise<any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
