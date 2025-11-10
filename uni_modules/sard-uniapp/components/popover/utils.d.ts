export type Position = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
export interface Rect {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export type Direction = 'top' | 'right' | 'bottom' | 'left';
export type Side = 'start' | 'center' | 'end';
export type Axis = 'top' | 'left';
export declare function getPopoverPosition(refRect: Rect, popperRect: Rect, { refGap, position, viewportGap, arrowSize, }: {
    position: Position;
    refGap: number;
    viewportGap: number;
    arrowSize: number;
}): readonly [{
    top: number;
    left: number;
}, {
    top: number;
    left: number;
}];
