import { type NodeRect } from '../utils';
export interface UseScrollSpyOptions {
    defaultCurrent?: string | number;
    getSpiedRect: () => Promise<NodeRect>;
    initialScroll?: boolean;
    startOffset?: number;
    onChange?: (name: string | number) => void;
}
export declare function useScrollSpy(options: UseScrollSpyOptions): {
    scrollTop: import("vue").Ref<number | undefined, number | undefined>;
    innerCurrent: import("vue").Ref<string | number | undefined, string | number | undefined>;
    anchorRectList: import("vue").ShallowRef<[string | number, NodeRect][], [string | number, NodeRect][]>;
    register: (name: string | number, getRect: () => Promise<NodeRect>) => void;
    unregister: (name: string | number) => void;
    onScroll: (event: any) => void;
    scrollTo: (name: string | number) => void;
    update: () => Promise<void>;
    initialize: () => Promise<void>;
};
