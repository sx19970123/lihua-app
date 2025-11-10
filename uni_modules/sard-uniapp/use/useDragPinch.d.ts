export interface UseTouchOptions {
    onOffset?: (offsetX: number, offsetY: number) => void;
    onScale?: (originX: number, originY: number, scale: number) => void;
    onCapture?: () => void;
    onRelease?: (v: {
        x: number;
        y: number;
    }) => void;
}
export declare function useDragPinch(options: UseTouchOptions): {
    onMouseDown: (event: MouseEvent) => void;
    onTouchStart: (event: TouchEvent) => void;
    onTouchMove: (event: TouchEvent) => void;
    onTouchEnd: (event: TouchEvent) => void;
};
