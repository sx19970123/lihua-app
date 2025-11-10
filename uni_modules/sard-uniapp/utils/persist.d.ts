export declare class Persist {
    name: string;
    prefix: string;
    cache: Record<string, {
        ttl: number;
        value: any;
    }>;
    constructor(name: string);
    private getCache;
    private save;
    get(key: string): any;
    set(key: string, value: any, ttl?: number): void;
    remove(key: string): void;
    clear(): void;
}
