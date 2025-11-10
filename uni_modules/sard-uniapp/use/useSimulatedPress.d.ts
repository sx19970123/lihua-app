export interface UseSimulatedPressOptions {
    start?: () => void;
    move?: (event: TouchEvent, extra: {
        delta: {
            x: number;
            y: number;
        };
    }) => void;
    end?: () => void;
    duration?: number;
}
export declare function useSimulatedPress(options?: UseSimulatedPressOptions): readonly [(event: TouchEvent) => void, (event: TouchEvent) => void, () => void];
