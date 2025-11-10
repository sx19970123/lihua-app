import { getTwoPointsDistance } from '../utils';
import { useTimeout } from './useTimeout';
export function useSimulatedPress(options = {}) {
    const { start, move, end, duration = 500 } = options;
    let downCoord = { x: 0, y: 0 };
    let isPressing = false;
    const { start: triggerPressLater, stop: cancelTriggerPress, isPending: isWaitingToTriggerPress, } = useTimeout(() => {
        isPressing = true;
        start?.();
    }, duration);
    const onTouchStart = (event) => {
        downCoord = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        triggerPressLater();
    };
    const onTouchMove = (event) => {
        const moveCoord = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
        };
        if (isPressing) {
            move?.(event, {
                delta: {
                    x: moveCoord.x - downCoord.x,
                    y: moveCoord.y - downCoord.y,
                },
            });
        }
        else if (isWaitingToTriggerPress.value) {
            const distance = getTwoPointsDistance(downCoord, moveCoord);
            if (distance > 10) {
                cancelTriggerPress();
            }
        }
    };
    const onTouchEnd = () => {
        cancelTriggerPress();
        if (isPressing) {
            isPressing = false;
            end?.();
        }
    };
    return [onTouchStart, onTouchMove, onTouchEnd];
}
