export interface UsePopoutInputVisibleProps {
    visible?: boolean;
}
export interface UsePopoutInputVisibleEmits {
    (e: 'update:visible', visible: boolean): void;
}
export declare function useTwoWayVisible(props: UsePopoutInputVisibleProps, emit: UsePopoutInputVisibleEmits): {
    visible: import("vue").Ref<boolean | undefined, boolean | undefined>;
};
