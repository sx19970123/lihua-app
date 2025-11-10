/**
 * 将字符串首字母转换为小写格式。
 */
export declare function lowerFirst(string: string): string;
/**
 * 将字符串首字母转换为大写格式。
 */
export declare function upperFirst(string: string): string;
/**
 * 将字符串转换为 PascalCase 格式（大驼峰）。
 */
export declare function pascalCase(string: string): string;
/**
 * 将字符串转换为 camelCase 格式（小驼峰）。
 */
export declare function camelCase(string: string): string;
/**
 * 将字符串转换为 Capitalize 格式（首字母大写，其余小写）。
 */
export declare function capitalize(string: string): string;
/**
 * 将字符串转换为 kebab-case 格式（使用连字符拼接单词）。
 */
export declare function kebabCase(string: string): string;
/**
 * 将字符串转换为 snake_case 格式（使用下划线拼接单词）。
 */
export declare function snakeCase(string: string): string;
/**
 * 每n位数字添加一个分隔符
 */
export declare function addSeparator(num: number | string, separator?: string, digit?: number): string;
/**
 * 生成唯一ID，用于设置元素的ID，以便获取
 */
export declare function uniqid(prefix?: string): string;
export type ClassProp = string | number | null | undefined | Record<string, any> | ClassProp[];
/**
 * 把各种类型的参数拼接成字符串类名，以便解决小程序不支持 classObject 的问题
 */
export declare function classNames(...args: ClassProp[]): string;
export type StyleProp = string | Record<any, any> | null | undefined | false | StyleProp[];
/**
 * 把样式对象拼接成字符串，解决小程序不支持 styleObject 的问题。
 */
export declare function stringifyStyle(...args: StyleProp[]): string;
