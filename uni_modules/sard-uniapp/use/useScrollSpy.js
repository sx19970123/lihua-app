import { computed, ref, shallowRef } from 'vue';
import { useTimeout } from './useTimeout';
import { isNullish, matchScrollVisible } from '../utils';
export function useScrollSpy(options) {
    const { defaultCurrent, initialScroll, onChange, getSpiedRect } = options;
    const startOffset = computed(() => options.startOffset || 0);
    let memoScrollTop = 0;
    const scrollTop = ref(0);
    const innerCurrent = ref(defaultCurrent);
    const anchorRectList = shallowRef([]);
    const anchorMap = new Map();
    let lockScroll = false;
    const { start: unLockScrollLater } = useTimeout(() => {
        lockScroll = false;
    }, 150);
    const register = (name, getRect) => {
        anchorMap.set(name, getRect);
    };
    const unregister = (name) => {
        anchorMap.delete(name);
    };
    const calcPosition = (offset) => {
        matchScrollVisible(anchorRectList.value.map((item) => item[1]), (index) => {
            const name = anchorRectList.value[index][0];
            if (name !== innerCurrent.value) {
                innerCurrent.value = name;
                onChange?.(name);
            }
        }, {
            offset,
        });
    };
    const onScroll = (event) => {
        memoScrollTop = event.detail.scrollTop;
        if (lockScroll) {
            return;
        }
        calcPosition(memoScrollTop + startOffset.value);
    };
    const scrollTo = (name) => {
        if (anchorRectList.value.length > 0) {
            const item = anchorRectList.value.find((item) => item[0] === name);
            if (item) {
                const offset = item[1].top;
                const nextScrollTop = offset - startOffset.value;
                scrollTop.value =
                    nextScrollTop === scrollTop.value
                        ? nextScrollTop + 0.1
                        : nextScrollTop;
                lockScroll = true;
                unLockScrollLater();
            }
        }
    };
    const getAllAnchorRect = async () => {
        const allRect = await Promise.all([...anchorMap].map(([name, getRect]) => {
            return new Promise((resolve) => {
                getRect().then((rect) => {
                    resolve([name, rect]);
                });
            });
        }));
        return allRect.sort((a, b) => {
            return a[1].top - b[1].top;
        });
    };
    const calcRect = async () => {
        const spiedRect = await getSpiedRect();
        anchorRectList.value = (await getAllAnchorRect()).map(([name, rect]) => {
            return [
                name,
                {
                    ...rect,
                    top: rect.top - spiedRect.top + memoScrollTop,
                    bottom: rect.bottom - spiedRect.top + memoScrollTop,
                },
            ];
        });
    };
    const update = async () => {
        await calcRect();
    };
    const initialize = async () => {
        await calcRect();
        if (isNullish(innerCurrent.value)) {
            innerCurrent.value = anchorRectList.value[0]?.[0];
        }
        if (initialScroll) {
            scrollTo(innerCurrent.value);
        }
    };
    return {
        scrollTop,
        innerCurrent,
        anchorRectList,
        register,
        unregister,
        onScroll,
        scrollTo,
        update,
        initialize,
    };
}
