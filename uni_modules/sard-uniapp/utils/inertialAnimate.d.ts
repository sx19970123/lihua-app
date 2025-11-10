export interface InertialAnimateOptions {
    update?: (value: number) => void;
    complete?: () => void;
}
export declare function createInertialAnimate(v: number, options: InertialAnimateOptions): {
    stop: () => void;
    play: () => void;
    isAnimating(): boolean;
};
export type InertialAnimate = ReturnType<typeof createInertialAnimate>;
