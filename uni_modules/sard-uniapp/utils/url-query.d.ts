export declare class URLQuery {
    _params: string[][];
    constructor(init?: string[][] | Record<string, string> | string | URLQuery);
    _fromString(queryString: string): void;
    get size(): number;
    append(name: string, value: string): void;
    delete(name: string, value?: string): void;
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string, value?: string): boolean;
    set(name: string, value: string): void;
    sort(): void;
    toString(): string;
    forEach(callbackfn: (value: string, key: string, parent: URLQuery) => void, thisArg?: any): void;
    entries(): ArrayIterator<string[]>;
    keys(): Generator<string, void, unknown>;
    values(): Generator<string, void, unknown>;
    [Symbol.iterator](): ArrayIterator<string[]>;
}
