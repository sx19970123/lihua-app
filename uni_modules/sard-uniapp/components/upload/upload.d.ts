import { type UploadProps, type UploadSlots, type UploadFile, type UploadFileItem, type UploadSelectOptions } from './common';
declare function __VLS_template(): Readonly<UploadSlots> & UploadSlots;
declare const __VLS_component: import("vue").DefineComponent<UploadProps, {
    select: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: UploadFileItem[]) => any;
    change: (value: UploadFileItem[]) => any;
    remove: (index: number, item: UploadFileItem) => any;
    "item-click": (item: UploadFileItem, index: number) => any;
}, string, import("vue").PublicProps, Readonly<UploadProps> & Readonly<{
    "onUpdate:model-value"?: ((value: UploadFileItem[]) => any) | undefined;
    onChange?: ((value: UploadFileItem[]) => any) | undefined;
    onRemove?: ((index: number, item: UploadFileItem) => any) | undefined;
    "onItem-click"?: ((item: UploadFileItem, index: number) => any) | undefined;
}>, {
    multiple: boolean;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: UploadFileItem[];
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    camera: "back" | "front";
    maxDuration: number;
    maxCount: number;
    maxSize: number | ((file: UploadFile) => boolean);
    overSize: (fileItem: UploadFileItem[]) => void;
    beforeChoose: (fileList: UploadFileItem[], next: (allowed: boolean | UploadSelectOptions) => void) => void;
    beforeRead: (file: UploadFile) => boolean | Promise<UploadFile>;
    afterRead: (fileItem: UploadFileItem) => void;
    removable: boolean;
    beforeRemove: (index: number, fileItem: UploadFileItem) => boolean | Promise<void>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
