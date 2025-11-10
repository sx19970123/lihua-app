/**
 * 判断是否为闰年。
 */
export declare function isLeapYear(year: number): boolean;
/**
 * 获取某月的天数，月份从0开始。
 */
export declare function getDaysInMonth(year: number, month: number): number;
/**
 * 获取当前日期是一年中的第几天。
 */
export declare function getDayOfYear(date: Date): number;
/**
 * 获取指定月份第一天是星期几，月份从0开始。
 */
export declare function getFirstDayWeekday(year: number, month: number): number;
/**
 * 获取从基准日期（如1970-01-01）到指定日期的总天数。
 */
export declare function getDaysSinceUnixEpoch(date: Date): number;
/**
 * 把日期转换为年月日数值，例如：2025年7月1号 -> 20250601。
 */
export declare function toDateNumber(date: Date): number;
/**
 * 把日期转换为年月日字符串，，例如：2025年7月1号 -> 2025-7-1。
 */
export declare function toDateString(date: Date): string;
/**
 * 把日期转换为年月数值，例如：2025年7月1号 -> 20250600。
 */
export declare function toMonthNumber(date: Date): number;
/**
 * 计算当前月份1号前面需要显示的上个月末尾的天数。
 */
export declare function getDaysBeforeFirstDay(year: number, month: number, weekStartsOn?: number): number;
/**
 * 获取当前月份最后一天之后需要显示的下个月开始的天数。
 */
export declare function getDaysAfterLastDay(year: number, month: number, weekStartsOn?: number): number;
/**
 * 获取当前月份1号之前需要显示的上个月末尾的日期。
 */
export declare function getPrevMonthTailDays(year: number, month: number, weekStartsOn?: number): Date[];
/**
 * 获取当前月份最后一天之后需要显示的下个月开始的日期。
 */
export declare function getNextMonthHeadDays(year: number, month: number, weekStartsOn?: number): Date[];
/**
 * 根据传入的占位符返回格式化后的日期。
 */
export declare function formatDate(date: Date, format?: string): string;
/**
 * 解析日期的字符串表示形式，并返回 Date 实例对象。
 */
export declare function parseDate(value: string, format?: string): Date;
export declare function toDate(date: Date | string, valueFormat?: string): Date;
export declare function minmaxDate(date: Date, minDate: Date, maxDate: Date): Date;
export declare function getPrevMonthDate(date: Date): Date;
export declare function getNextMonthDate(date: Date): Date;
/****************************************************************
 * 农历
 ****************************************************************/
export declare const lunarInfo: number[];
export declare const springFestivals: number[][];
export declare const baseLunarYear = 1900;
/**
 * 获取农历某年闰月的月份，月份从1开始（0表示无闰月）。
 */
export declare function getLunarLeapMonth(year: number): number;
/**
 * 获取农历某年闰月的天数。
 */
export declare function getLunarLeapMonthDays(year: number): number;
/**
 * 获取农历某年的总天数。
 */
export declare function getLunarYearDays(year: number): number;
/**
 * 获取农历某年某月的天数，月份从1开始。
 */
export declare function getLunarMonthDays(year: number, month: number): number;
/**
 * 公历转农历，月份从1开始（返回的闰月为负数）。
 */
export declare function solarToLunar(year: number, month: number, day: number): {
    year: number;
    month: number;
    day: number;
};
/**
 * 农历转公历（闰月需传递负数）。
 */
export declare function lunarToSolar(year: number, month: number, day: number): {
    year: number;
    month: number;
    day: number;
};
export declare const lunarYearNames: string[];
/**
 * 将阿拉伯数字的年份转为汉字数字年份
 */
export declare function getLunarYearName(year: number): string;
export declare const lunarMonthNames: string[];
/**
 * 获取农历月份名称，月份从1开始，例如：正月，十月，腊月。
 */
export declare function getLunarMonthName(month: number, isLeapMonth?: boolean): string;
export declare const lunarDayNames: string[];
/**
 * 获取农历日期名称，例如：初一，十二，廿一。
 */
export declare function getLunarDayName(day: number): string;
export declare const heavenlyStems: string[];
export declare const earthlyBranches: string[];
/**
 * 获取农历时辰名称，例如：子初、子正、午初，午正。
 */
export declare function getLunarHourName(hour: number): string;
