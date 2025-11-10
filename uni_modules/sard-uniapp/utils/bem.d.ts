export interface BemConfig {
    namespace: string;
    blockSeparator: string;
    elementSeparator: string;
    modifierSeparator: string;
}
type IsType = boolean | number | string | null | undefined | object;
export declare function createBemStruct(config: BemConfig): (block: string | number) => {
    b(): string;
    e(element: string | number | undefined | null, is?: IsType): string;
    m(modifier: string | number | undefined | null, is?: IsType): string;
    em(element: string | number, modifier: string | number | undefined | null, is?: IsType): string;
    bem(block: string | number, element?: string | number, modifier?: string | number, is?: boolean | number | string | undefined | null): string;
};
export declare const createBem: (block: string | number) => {
    b(): string;
    e(element: string | number | undefined | null, is?: IsType): string;
    m(modifier: string | number | undefined | null, is?: IsType): string;
    em(element: string | number, modifier: string | number | undefined | null, is?: IsType): string;
    bem(block: string | number, element?: string | number, modifier?: string | number, is?: boolean | number | string | undefined | null): string;
};
export type Bem = ReturnType<typeof createBem>;
export {};
