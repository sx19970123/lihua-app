export class URLQuery {
    _params = [];
    constructor(init) {
        this._params = [];
        if (init) {
            if (typeof init === 'string') {
                this._fromString(init);
            }
            else if (Array.isArray(init)) {
                init.forEach(([name, value]) => {
                    this.append(name, value);
                });
            }
            else if (typeof init === 'object') {
                Object.entries(init).forEach(([name, value]) => {
                    this.append(name, value);
                });
            }
        }
    }
    // 解析查询字符串
    _fromString(queryString) {
        if (queryString.startsWith('?')) {
            queryString = queryString.slice(1);
        }
        queryString.split('&').forEach((pair) => {
            const [name, value = ''] = pair.split('=').map(decodeURIComponent);
            if (name) {
                this.append(name, value);
            }
        });
    }
    get size() {
        return this._params.length;
    }
    // 添加键值对
    append(name, value) {
        this._params.push([String(name), String(value)]);
    }
    // 删除指定 name 的所有值
    delete(name, value) {
        this._params = this._params.filter(([k, v]) => name !== k || (value && value !== v));
    }
    // 获取第一个匹配的 value
    get(name) {
        const found = this._params.find(([k]) => k === name);
        return found ? found[1] : null;
    }
    // 获取所有匹配的 values
    getAll(name) {
        return this._params.filter(([k]) => k === name).map(([, v]) => v);
    }
    // 检查是否存在 name
    has(name, value) {
        return this._params.some(([k, v]) => k === name && (!value || value === v));
    }
    // 设置 name 的值（覆盖所有旧值）
    set(name, value) {
        this.delete(name);
        this.append(name, value);
    }
    // 按键名排序
    sort() {
        this._params.sort(([a], [b]) => a.localeCompare(b));
    }
    // 转换为查询字符串
    toString() {
        return this._params
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
    }
    forEach(callbackfn, thisArg) {
        this._params.forEach(([name, value]) => {
            callbackfn.call(thisArg, value, name, this);
        });
    }
    // 迭代方法
    entries() {
        return this._params[Symbol.iterator]();
    }
    *keys() {
        for (const [name] of this._params) {
            yield name;
        }
    }
    *values() {
        for (const [, value] of this._params) {
            yield value;
        }
    }
    // 支持 for...of 迭代
    [Symbol.iterator]() {
        return this.entries();
    }
}
