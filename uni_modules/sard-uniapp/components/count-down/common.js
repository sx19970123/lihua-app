import { defaultConfig } from '../config';
export const defaultCountDownProps = defaultConfig.countDown;
export function getCurrentTime(remainTime) {
    return {
        milliseconds: remainTime % 1000,
        seconds: ~~(remainTime / 1000) % 60,
        minutes: ~~(remainTime / 1000 / 60) % 60,
        hours: ~~(remainTime / 1000 / 60 / 60) % 24,
        days: ~~(remainTime / 1000 / 60 / 60 / 24),
        total: remainTime,
    };
}
function padZero(n, length = 2) {
    return String(n).padStart(length, '0');
}
export function formatTime(format, currentTime) {
    return format
        .replace(/DD/g, padZero(currentTime.days))
        .replace(/HH/g, padZero(currentTime.hours))
        .replace(/mm/g, padZero(currentTime.minutes))
        .replace(/ss/g, padZero(currentTime.seconds))
        .replace(/s/g, String(currentTime.seconds))
        .replace(/SSS/g, padZero(currentTime.milliseconds, 3))
        .replace(/SS/g, padZero(currentTime.milliseconds, 3).slice(0, 2))
        .replace(/S/g, padZero(currentTime.milliseconds, 3).slice(0, 1));
}
