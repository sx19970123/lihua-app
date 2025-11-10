import { AnyObject } from './common';
/**
 * 此方法创建一个对象，该对象由自己不可省略的属性组成。
 */
export declare function omit<T extends object, U extends keyof T>(object: T, paths: U[]): Omit<T, U>;
/**
 * 深度克隆对象，仅克隆数组和无格式对象，其他类型会被直接返回
 */
export declare function deepClone(target: any): any;
/**
 * 深拷贝其他对象到第一个对象
 */
export declare function extend(...args: any[]): any;
export declare function treeToMap(tree: AnyObject[], keyName: string, childrenName: string, parentName: string): {
    [p: string]: AnyObject;
};
/**
 * @description: 链式获取对象值
 * @param object
 * @param chain 通过点分割的字符串或者字符串数组
 */
export declare function chainGet(object: any, chain?: string | number | (string | number)[]): any;
/**
 * @description: 链式设置对象值
 * @param object
 * @param chain 通过点分割的字符串或者字符串数组
 * @param value 要设置的值
 */
export declare function chainSet(object: any, chain: string | number | (string | number)[], value: any): void;
export declare function nestedToMulti(nested: any[], values: (number | string)[], fieldKeys: {
    value: string;
    children: string;
}): any[];
