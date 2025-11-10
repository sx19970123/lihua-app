import { type StyleValue } from 'vue';
export interface KeyboardProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'number' | 'digit' | 'idcard' | 'random' | 'plate';
    mode?: KeyboardPlateMode;
}
export declare const defaultKeyboardProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "number" | "digit" | "idcard" | "random" | "plate";
        mode: KeyboardPlateMode;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "number" | "digit" | "idcard" | "random" | "plate";
        mode: KeyboardPlateMode;
    }) => string)) | undefined;
    type?: ("number" | "idcard" | "digit" | "random" | "plate" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "number" | "digit" | "idcard" | "random" | "plate";
        mode: KeyboardPlateMode;
    }) => "number" | "idcard" | "digit" | "random" | "plate")) | undefined;
    mode?: (KeyboardPlateMode | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "number" | "digit" | "idcard" | "random" | "plate";
        mode: KeyboardPlateMode;
    }) => "chinese" | "english")) | undefined;
};
export interface KeyboardSlots {
    default?(props: Record<string, never>): any;
}
export type KeyboardPlateMode = 'chinese' | 'english';
export interface KeyboardEmits {
    (e: 'input', key: string): void;
    (e: 'delete'): void;
    (e: 'toggle', mode: KeyboardPlateMode): void;
    (e: 'update:mode', mode: KeyboardPlateMode): void;
}
export interface KeyBoardExpose {
    shuffle: () => void;
    toggle: (mode?: KeyboardPlateMode) => void;
}
export declare const numberKeys: string[];
export declare const digitKeys: string[];
export declare const idcardKeys: string[];
export declare const chineseKeys: string[];
export declare const englishKeys: string[];
export declare function getRandomKeys(): string[];
