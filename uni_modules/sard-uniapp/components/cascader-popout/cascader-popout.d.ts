import { type CascaderPopoutProps, type CascaderPopoutSlots } from './common';
declare function __VLS_template(): Readonly<CascaderPopoutSlots> & CascaderPopoutSlots;
declare const __VLS_component: import("vue").DefineComponent<CascaderPopoutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CascaderPopoutProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    options: import("../cascader/common.js").CascaderOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: string | number | (string | number)[];
    title: string;
    visible: boolean;
    showConfirm: boolean;
    validateEvent: boolean;
    popoutClass: string;
    popoutStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    resettable: boolean;
    fieldKeys: import("../cascader/common.js").CascaderFieldKeys;
    hintText: string;
    labelRender: (option: import("../cascader/common.js").CascaderOption) => string;
    changeOnSelect: boolean;
    allLevels: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
