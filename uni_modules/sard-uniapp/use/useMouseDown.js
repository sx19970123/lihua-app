import { toTouchEvent } from '../utils';
export function useMouseDown(startCallback, moveCallback, endCallback) {
    return (event) => {
        // #ifdef WEB
        if ('ontouchstart' in document) {
            return;
        }
        startCallback?.(toTouchEvent(event));
        const moveHandler = (event) => {
            event.preventDefault();
            moveCallback?.(toTouchEvent(event));
        };
        const upHandler = (event) => {
            endCallback?.(toTouchEvent(event));
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        // #endif
    };
}
