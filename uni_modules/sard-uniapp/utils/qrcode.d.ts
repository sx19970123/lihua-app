export declare const ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
interface QrcodeOptions {
    ecl?: ECL;
}
export type ECL = 'L' | 'M' | 'Q' | 'H';
export declare const ECLList: ECL[];
export declare function qrcode(text: string, options?: QrcodeOptions): number[][];
export {};
