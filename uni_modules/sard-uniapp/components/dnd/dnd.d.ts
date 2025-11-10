import { type DndProps, type DndSlots, type DndExpose } from './common';
declare const _default: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_Prettify<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_Prettify<Pick<Partial<{}> & Omit<{
        readonly "onItem-drag-start"?: ((event: {
            itemIndex: number;
        }) => any) | undefined;
        readonly "onItem-drag-move"?: ((event: {
            itemIndex: number;
            insertIndex: number;
        }) => any) | undefined;
        readonly "onItem-drop"?: ((event: {
            itemIndex: number;
            insertIndex: number;
        }) => any) | undefined;
        readonly "onUpdate:list"?: ((list: T[]) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onItem-drag-start" | "onItem-drag-move" | "onItem-drop" | "onUpdate:list"> & DndProps<T>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<DndExpose>): void;
    attrs: any;
    slots: ReturnType<() => Readonly<DndSlots<T>> & DndSlots<T>>;
    emit: (((evt: "item-drag-start", event: {
        itemIndex: number;
    }) => void) & ((evt: "item-drag-move", event: {
        itemIndex: number;
        insertIndex: number;
    }) => void) & ((evt: "item-drop", event: {
        itemIndex: number;
        insertIndex: number;
    }) => void) & ((evt: "update:list", list: T[]) => void)) & {};
}>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
