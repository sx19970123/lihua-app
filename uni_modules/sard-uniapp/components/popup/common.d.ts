import { type StyleValue } from 'vue';
import { type TransitionHookName } from '../../use';
export interface PopupProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    visible?: boolean;
    duration?: number;
    effect?: 'slide-top' | 'slide-right' | 'slide-bottom' | 'slide-left' | 'zoom' | 'fade' | 'full-fade';
    overlay?: boolean;
    overlayClass?: string;
    overlayStyle?: string;
    background?: string;
    transparent?: boolean;
    keepRender?: boolean;
    overlayClosable?: boolean;
}
export declare const defaultPopupProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => boolean)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => number)) | undefined;
    effect?: ("slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade")) | undefined;
    overlay?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => boolean)) | undefined;
    overlayClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => string)) | undefined;
    overlayStyle?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => string)) | undefined;
    transparent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => boolean)) | undefined;
    keepRender?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => boolean)) | undefined;
    overlayClosable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        duration: number;
        effect: "slide-top" | "slide-right" | "slide-bottom" | "slide-left" | "zoom" | "fade" | "full-fade";
        overlay: boolean;
        overlayClass: string;
        overlayStyle: string;
        background: string;
        transparent: boolean;
        keepRender: boolean;
        overlayClosable: boolean;
    }) => boolean)) | undefined;
};
export interface PopupSlots {
    default?(props: Record<string, never>): any;
}
export interface TransitionHookEmits {
    (e: 'before-enter'): void;
    (e: 'enter'): void;
    (e: 'after-enter'): void;
    (e: 'enter-cancelled'): void;
    (e: 'before-leave'): void;
    (e: 'leave'): void;
    (e: 'after-leave'): void;
    (e: 'leave-cancelled'): void;
    (e: 'visible-hook', name: TransitionHookName): void;
}
export interface TransitionHookCallbacks {
    onVisibleHook?: (name: TransitionHookName) => void;
    onBeforeEnter?: () => void;
    onEnter?: () => void;
    onAfterEnter?: () => void;
    onEnterCancelled?: () => void;
    onBeforeLeave?: () => void;
    onLeave?: () => void;
    onAfterLeave?: () => void;
    onLeaveCancelled?: () => void;
}
export interface PopupEmits extends TransitionHookEmits {
    (e: 'overlay-click', event: any): void;
    (e: 'update:visible', visible: boolean): void;
}
export interface PopupContext {
    visibleState: TransitionHookName | undefined;
}
export declare const popupContextSymbol: unique symbol;
export declare function usePopupVisibleHookProvide(): (name: TransitionHookName) => void;
export declare function usePopupEnter(callback: () => void): void;
export declare function useInPopup(): boolean;
