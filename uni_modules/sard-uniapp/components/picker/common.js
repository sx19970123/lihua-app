import { defaultConfig } from '../config';
export const defaultPickerProps = () => ({
    ...defaultConfig.picker,
    columns: () => [],
});
export const defaultOptionKeys = {
    label: 'label',
    value: 'value',
    children: 'children',
};
export function getColumnsType(columns, optionKeys) {
    const firstColumn = columns[0];
    if (Array.isArray(firstColumn)) {
        return 'multi';
    }
    if (firstColumn &&
        typeof firstColumn === 'object' &&
        Array.isArray(firstColumn[optionKeys.children])) {
        return 'cascader';
    }
    return 'single';
}
export function getValueOrLabelByOption(option, valueOrLabelKey) {
    const isPrimitive = option !== null && typeof option !== 'object';
    return (isPrimitive ? option : option[valueOrLabelKey]);
}
export function getValuesByOptions(options, valueKey) {
    return options.map((option) => getValueOrLabelByOption(option, valueKey));
}
export function getOptionsByIndexes(indexes, columns, optionKeys) {
    function recurse(columns, i = 0) {
        const index = Math.min(indexes[i], columns.length - 1);
        const option = columns[index];
        const nextColumn = option?.[optionKeys.children];
        if (Array.isArray(nextColumn)) {
            return [option, ...recurse(nextColumn, ++i)];
        }
        return [option];
    }
    switch (getColumnsType(columns, optionKeys)) {
        case 'single':
            return [columns[indexes[0]]];
        case 'multi':
            return columns.map((column, i) => column[indexes[i]]);
        case 'cascader':
            return recurse(columns);
    }
}
export function getCascaderValidIndexes(indexes, columns, optionKeys) {
    function recurse(columns, i = 0) {
        let index = Math.min(indexes[i], columns.length - 1);
        const option = columns[index];
        if (!option) {
            index = 0;
        }
        const nextColumn = option?.[optionKeys.children];
        if (Array.isArray(nextColumn)) {
            return [index, ...recurse(nextColumn, ++i)];
        }
        return [index];
    }
    return recurse(columns);
}
export function getMaySingleValueByOptions(options, optionKeys, columns) {
    const values = getValuesByOptions(options, optionKeys.value);
    return getColumnsType(columns, optionKeys) === 'single' ? values[0] : values;
}
export function getIndexesByValue(value, columns, optionKeys) {
    const type = getColumnsType(columns, optionKeys);
    function recurse(columns, i = 0) {
        let index = columns.findIndex((option) => option[optionKeys.value] === value[i]);
        if (index === -1) {
            index = 0;
        }
        const option = columns[index];
        const nextColumn = option?.[optionKeys.children];
        if (Array.isArray(nextColumn)) {
            return [index, ...recurse(nextColumn, ++i)];
        }
        return [index];
    }
    if (type === 'cascader') {
        return recurse(columns);
    }
    if (type === 'single') {
        columns = [columns];
    }
    return columns.map((column, index) => {
        const optionIndex = column.findIndex((option) => getValueOrLabelByOption(option, optionKeys.value) === value[index]);
        return Math.max(optionIndex, 0);
    });
}
export function getInitialValue(columns, optionKeys) {
    function recurse(columns, options) {
        const option = columns[0];
        options.push(option);
        const nextColumn = option?.[optionKeys.children];
        if (Array.isArray(nextColumn) && nextColumn.length > 0) {
            return recurse(nextColumn, options);
        }
        return option;
    }
    switch (getColumnsType(columns, optionKeys)) {
        case 'single':
            return [
                getValueOrLabelByOption(columns[0], optionKeys.value),
                [columns[0]],
            ];
        case 'multi':
            return [
                columns.map((column) => getValueOrLabelByOption(column[0], optionKeys.value)),
                columns.map((column) => column[0]),
            ];
        case 'cascader': {
            const options = [];
            recurse(columns, options);
            return [
                options.map((option) => getValueOrLabelByOption(option, optionKeys.value)),
                options,
            ];
        }
    }
}
