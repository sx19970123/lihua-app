import { computed, effectScope, isRef, onScopeDispose, shallowRef, unref, watch, } from 'vue';
import { useLuckyDraw } from './useLuckyDraw';
const defaultOptions = {
    columns: [],
    minSpeed: 0.01,
    maxSpeed: 0.3,
    staggerDelay: 600,
    endDelay: 300,
};
export function useSlotMachine(options) {
    const { columns, staggerDelay, complete, ...restOptions } = Object.assign({}, defaultOptions, options);
    let count = 0;
    let indexes = [];
    let scopes = [];
    const controls = shallowRef([]);
    watch(isRef(columns) ? columns : () => columns, () => {
        scopes.forEach((scope) => scope.stop());
        const controlList = [];
        scopes = unref(columns).map((column, index) => {
            const scope = effectScope();
            scope.run(() => {
                controlList[index] = useLuckyDraw({
                    ...restOptions,
                    count: Array.isArray(column) ? column.length : column,
                    startDelay: index * unref(staggerDelay),
                    complete: (i) => {
                        indexes[index] = i;
                        if (++count >= unref(columns).length) {
                            complete?.([...indexes]);
                            count = 0;
                            indexes = [];
                        }
                    },
                });
            });
            return scope;
        });
        controls.value = controlList;
    }, {
        immediate: true,
    });
    onScopeDispose(() => {
        scopes.forEach((scope) => scope.stop());
    });
    const play = () => {
        controls.value.forEach((control) => {
            control.play();
        });
    };
    const stop = (index = []) => {
        controls.value.forEach((control, i) => {
            control.stop(index[i]);
        });
    };
    const pause = () => {
        count = 0;
        indexes = [];
        controls.value.forEach((control) => {
            control.pause();
        });
    };
    const reset = () => {
        count = 0;
        indexes = [];
        controls.value.forEach((control) => {
            control.reset();
        });
    };
    return {
        play,
        stop,
        pause,
        reset,
        playing: computed(() => {
            return controls.value.some((control) => control.playing.value);
        }),
        offset: computed(() => {
            return controls.value.map((control, index) => {
                const column = unref(columns)[index];
                const count = Array.isArray(column) ? column.length : column;
                return control.activeIndex.value !== undefined
                    ? (control.activeIndex.value % count) * 100
                    : 0;
            });
        }),
    };
}
