import { type StyleValue } from 'vue';
export interface MarqueeProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    direction?: 'vertical' | 'horizontal';
    delay?: number;
    speed?: number;
}
export declare const defaultMarqueeProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        delay: number;
        speed: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        delay: number;
        speed: number;
    }) => string)) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        delay: number;
        speed: number;
    }) => "horizontal" | "vertical")) | undefined;
    delay?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        delay: number;
        speed: number;
    }) => number)) | undefined;
    speed?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        direction: "vertical" | "horizontal";
        delay: number;
        speed: number;
    }) => number)) | undefined;
};
export interface MarqueeSlots {
    default?(props: Record<string, never>): any;
}
export interface MarqueeExpose {
    update: () => void;
}
