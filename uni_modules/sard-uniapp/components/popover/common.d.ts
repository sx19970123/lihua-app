import { type StyleValue } from 'vue';
import { type MenuOption } from '../menu/common';
import { type NodeRect } from '../../utils';
import { PopoverController } from './usePopover';
import { type Position } from './utils';
export interface PopoverProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    visible?: boolean;
    options?: MenuOption[];
    position?: Position;
    direction?: 'vertical' | 'horizontal';
    theme?: 'dark' | 'light';
    refGap?: number;
    viewportGap?: number;
    transparent?: boolean;
    controller?: PopoverController;
    duration?: number;
}
export declare const defaultPopoverProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => boolean)) | undefined;
    options?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => MenuOption[]) | undefined;
    position?: (Position | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => "left" | "right" | "bottom" | "top" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end")) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => "horizontal" | "vertical")) | undefined;
    theme?: ("dark" | "light" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => "dark" | "light")) | undefined;
    refGap?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => number)) | undefined;
    viewportGap?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => number)) | undefined;
    transparent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => boolean)) | undefined;
    controller?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => PopoverController) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        options: MenuOption[];
        position: Position;
        direction: "vertical" | "horizontal";
        theme: "dark" | "light";
        refGap: number;
        viewportGap: number;
        transparent: boolean;
        controller: PopoverController;
        duration: number;
    }) => number)) | undefined;
};
export interface PopoverSlots {
    default?(props: Record<string, never>): any;
    content?(props: Record<string, never>): any;
}
export interface PopoverEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'select', option: MenuOption): void;
}
export interface ReferenceExpose {
    getRect: () => NodeRect | Promise<NodeRect> | undefined;
}
export interface PopoverReferenceProps {
    rootStyle?: StyleValue;
    rootClass?: string;
}
export interface PopoverReferenceSlots {
    default?(props: Record<string, never>): any;
}
export interface PopoverReferenceEmits {
    (e: 'click', event: any): void;
}
export interface PopoverContext {
    show: () => void;
    register: (expose: ReferenceExpose) => void;
}
export declare const popoverContextSymbol: unique symbol;
