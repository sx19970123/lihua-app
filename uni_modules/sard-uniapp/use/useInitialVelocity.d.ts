interface Point {
    x: number;
    y: number;
}
export declare function useInitialVelocity(): {
    onStart: (point: Point) => void;
    onMove: (point: Point) => void;
    onEnd: () => {
        x: number;
        y: number;
    };
};
export {};
