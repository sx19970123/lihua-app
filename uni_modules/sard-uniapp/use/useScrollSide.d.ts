export declare function useScrollSide(): {
    scrollSide: import("vue").Ref<"start" | "center" | "end" | null, "start" | "center" | "end" | null>;
    onScroll: (event: any) => void;
    onScrolltoupper: () => void;
    onScrolltolower: () => void;
};
