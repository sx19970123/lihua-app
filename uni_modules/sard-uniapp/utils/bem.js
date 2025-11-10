const defaultBem = {
    namespace: 'sar',
    blockSeparator: '-',
    elementSeparator: '__',
    modifierSeparator: '_',
};
export function createBemStruct(config) {
    const { namespace, blockSeparator, elementSeparator, modifierSeparator } = config;
    return (block) => {
        const prefix = namespace + blockSeparator + block;
        return {
            b() {
                return prefix;
            },
            e(element, is) {
                if (arguments.length === 2 && !is) {
                    return '';
                }
                return prefix + elementSeparator + element;
            },
            m(modifier, is) {
                if (arguments.length === 2 && !is) {
                    return '';
                }
                return prefix + modifierSeparator + modifier;
            },
            em(element, modifier, is) {
                if (arguments.length === 3 && !is) {
                    return '';
                }
                return (prefix + elementSeparator + element + modifierSeparator + modifier);
            },
            bem(block, element, modifier, is) {
                if (arguments.length === 4 && !is) {
                    return '';
                }
                let className = namespace + blockSeparator + block;
                if (element) {
                    className += elementSeparator + element;
                }
                if (modifier) {
                    className += modifierSeparator + modifier;
                }
                return className;
            },
        };
    };
}
export const createBem = createBemStruct(defaultBem);
