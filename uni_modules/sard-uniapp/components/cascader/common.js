export const defaultCascaderProps = {
    options: () => [],
};
export const defaultFieldKeys = {
    label: 'label',
    value: 'value',
    disabled: 'disabled',
    children: 'children',
};
export function getSelectedOptionsByValue(options, value, fieldKeys) {
    if (Array.isArray(value)) {
        const selectedOptions = [];
        let list = options;
        for (const item of value) {
            const option = list.find((option) => option[fieldKeys.value] === item);
            if (!option)
                break;
            selectedOptions.push(option);
            list = option[fieldKeys.children];
            if (!Array.isArray(list))
                break;
        }
        return selectedOptions;
    }
    else {
        for (const option of options) {
            if (option[fieldKeys.value] === value) {
                return [option];
            }
            if (Array.isArray(option[fieldKeys.children])) {
                const selectedOptions = getSelectedOptionsByValue(option[fieldKeys.children], value, fieldKeys);
                if (selectedOptions) {
                    return [option, ...selectedOptions];
                }
            }
        }
    }
}
