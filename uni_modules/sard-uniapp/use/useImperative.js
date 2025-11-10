import { onMounted, onUnmounted } from 'vue';
import { onHide, onShow } from '@dcloudio/uni-app';
const allImperatives = {};
export function useImperative(name, imperative, id) {
    onMounted(() => {
        if (id.value) {
            const imperativeItems = ((allImperatives[name] ??= {})[id.value] ??= []);
            const index = imperativeItems.findIndex((item) => item.imperative === imperative);
            if (index === -1) {
                imperativeItems.push({
                    imperative,
                    show: true,
                });
            }
        }
    });
    onUnmounted(() => {
        if (id.value) {
            const imperativeItems = allImperatives[name]?.[id.value];
            if (imperativeItems) {
                const index = imperativeItems.findIndex((item) => item.imperative === imperative);
                if (index !== -1) {
                    imperativeItems.splice(index, 1);
                    if (imperativeItems.length === 0) {
                        delete allImperatives[name]?.[id.value];
                    }
                }
            }
        }
    });
    onShow(() => {
        if (id.value) {
            const imperativeItems = allImperatives[name]?.[id.value];
            if (imperativeItems) {
                const imperativeItem = imperativeItems.find((item) => item.imperative === imperative);
                if (imperativeItem) {
                    imperativeItem.show = true;
                }
            }
        }
    });
    onHide(() => {
        if (id.value) {
            const imperativeItems = allImperatives[name]?.[id.value];
            if (imperativeItems) {
                const imperativeItem = imperativeItems.find((item) => item.imperative === imperative);
                if (imperativeItem) {
                    imperativeItem.show = false;
                }
            }
        }
    });
}
export function getAvailableImperative(name, id) {
    const imperativeItems = allImperatives[name]?.[id];
    if (imperativeItems) {
        for (let i = imperativeItems.length - 1; i >= 0; i--) {
            const imperativeItem = imperativeItems[i];
            if (imperativeItem.show) {
                return imperativeItem.imperative;
            }
        }
        return imperativeItems[imperativeItems.length - 1]?.imperative;
    }
}
export function getImperatives(name, id) {
    return allImperatives[name]?.[id];
}
export function getAllImperatives() {
    return allImperatives;
}
