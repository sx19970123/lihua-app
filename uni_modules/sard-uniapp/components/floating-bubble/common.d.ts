import { type StyleValue } from 'vue';
export interface FloatingBubbleProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    draggable?: boolean;
    axis?: 'x' | 'y' | 'both' | 'none';
    magnet?: 'x' | 'y';
    gapX?: number;
    gapY?: number;
    offset?: {
        x: number;
        y: number;
    };
    navbarHeight?: number;
    tabbarHeight?: number;
}
export declare const defaultFloatingBubbleProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => string)) | undefined;
    draggable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => boolean)) | undefined;
    axis?: ("x" | "y" | "none" | "both" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => "x" | "y" | "none" | "both")) | undefined;
    magnet?: ("x" | "y" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => "x" | "y")) | undefined;
    gapX?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => number)) | undefined;
    gapY?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => number)) | undefined;
    offset?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => {
        x: number;
        y: number;
    }) | undefined;
    navbarHeight?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => number)) | undefined;
    tabbarHeight?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        draggable: boolean;
        axis: "x" | "y" | "both" | "none";
        magnet: "x" | "y";
        gapX: number;
        gapY: number;
        offset: {
            x: number;
            y: number;
        };
        navbarHeight: number;
        tabbarHeight: number;
    }) => number)) | undefined;
};
export interface FloatingBubbleSlots {
    default?(props: Record<string, never>): any;
}
export interface FloatingBubbleEmits {
    (e: 'click', event: any): void;
    (e: 'update:offset', offset: {
        x: number;
        y: number;
    }): void;
}
