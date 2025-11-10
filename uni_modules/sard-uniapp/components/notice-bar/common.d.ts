import { type StyleValue } from 'vue';
export interface NoticeBarProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    color?: string;
    background?: string;
    hideLeftIcon?: boolean;
    delay?: number;
    speed?: number;
    scrollable?: 'auto' | 'never' | 'always';
    wrap?: boolean;
    closable?: boolean;
    linkable?: boolean;
    visible?: boolean;
    vertical?: boolean;
}
export declare const defaultNoticeBarProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => string)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => string)) | undefined;
    hideLeftIcon?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
    delay?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => number)) | undefined;
    speed?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => number)) | undefined;
    scrollable?: ("auto" | "never" | "always" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => "auto" | "never" | "always")) | undefined;
    wrap?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
    closable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
    linkable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
    vertical?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        color: string;
        background: string;
        hideLeftIcon: boolean;
        delay: number;
        speed: number;
        scrollable: "auto" | "never" | "always";
        wrap: boolean;
        closable: boolean;
        linkable: boolean;
        visible: boolean;
        vertical: boolean;
    }) => boolean)) | undefined;
};
export interface NoticeBarSlots {
    default?(props: Record<string, never>): any;
    'left-icon'?(props: Record<string, never>): any;
    'right-icon'?(props: Record<string, never>): any;
}
export interface NoticeBarEmits {
    (e: 'click', event: any): void;
    (e: 'close'): void;
}
export interface NoticeBarExpose {
    update: () => void;
}
