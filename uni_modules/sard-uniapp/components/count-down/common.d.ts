import { type StyleValue } from 'vue';
export interface CountDownProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    time?: number;
    autoStart?: boolean;
    format?: string;
    millisecond?: boolean;
}
export declare const defaultCountDownProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => string)) | undefined;
    time?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => number)) | undefined;
    autoStart?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => boolean)) | undefined;
    format?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => string)) | undefined;
    millisecond?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        time: number;
        autoStart: boolean;
        format: string;
        millisecond: boolean;
    }) => boolean)) | undefined;
};
export interface CountDownSlots {
    default?(props: {
        time: CountDownCurrentTime;
    }): any;
}
export interface CountDownEmits {
    (e: 'change', time: CountDownCurrentTime): void;
    (e: 'finish'): void;
}
export interface CountDownExpose {
    start: () => void;
    pause: () => void;
    reset: () => void;
}
export interface CountDownCurrentTime {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    total: number;
}
export declare function getCurrentTime(remainTime: number): CountDownCurrentTime;
export declare function formatTime(format: string, currentTime: CountDownCurrentTime): string;
