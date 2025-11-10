import { URLQuery } from './url-query';
export class Router {
    status = 'idle';
    guards = [];
    resolvePath(currentPath, path) {
        if (/^\//.test(path)) {
            return path;
        }
        const fragments = currentPath.replace(/\/[^/]+$/, '').split('/');
        if (path.startsWith('./')) {
            path = path.slice(2);
        }
        fragments.push(...path.split('/'));
        const count = fragments.filter((frag) => frag === '..').length;
        for (let i = 0; i < count; i++) {
            const index = fragments.indexOf('..');
            fragments.splice(index - 1, 2);
        }
        return '/' + fragments.join('/');
    }
    parseQuery(url) {
        const [pathPart, queryPart] = url.split('?');
        const pathQuery = {
            url: pathPart,
        };
        if (queryPart) {
            pathQuery.query = Object.fromEntries(new URLQuery(queryPart));
        }
        return pathQuery;
    }
    getPathQuery(currentPath, route) {
        const toRoute = typeof route === 'string'
            ? this.parseQuery(route)
            : this.parseQuery(route.url);
        return {
            url: this.resolvePath(currentPath, toRoute.url),
            query: {
                ...toRoute.query,
                ...(typeof route !== 'string' ? route.query : null),
            },
        };
    }
    makeUniRouteOptions(to, options) {
        const url = to.url +
            (Object.keys(to.query).length > 0
                ? '?' + new URLQuery(Object.entries(to.query)).toString()
                : '');
        return {
            ...options,
            url,
        };
    }
    async intercept(options, action) {
        if (this.status === 'busy') {
            return;
        }
        this.status = 'busy';
        const complete = options.complete;
        options.complete = (result) => {
            this.status = 'idle';
            complete?.(result);
        };
        const pages = getCurrentPages();
        const currentPath = pages[pages.length - 1].route;
        const toPathQuery = this.getPathQuery(currentPath, {
            url: options.url,
            query: options.query,
        });
        const fromPathQuery = {
            url: '/' + currentPath,
            query: {},
        };
        try {
            for (const guard of this.guards) {
                const result = await guard(toPathQuery, fromPathQuery);
                if (result === false) {
                    this.status = 'idle';
                    return;
                }
                if (typeof result === 'string') {
                    return action(this.makeUniRouteOptions(this.getPathQuery(currentPath, result), options));
                }
                if (result !== null && typeof result === 'object') {
                    return action(this.makeUniRouteOptions(this.getPathQuery(currentPath, result), options));
                }
            }
        }
        catch (err) {
            this.status = 'idle';
            console.error(err);
            return;
        }
        return action(this.makeUniRouteOptions(toPathQuery, options));
    }
    navigateTo(options) {
        return this.intercept(options, uni.navigateTo);
    }
    redirectTo(options) {
        return this.intercept(options, uni.redirectTo);
    }
    reLaunch(options) {
        return this.intercept(options, uni.reLaunch);
    }
    switchTab(options) {
        return this.intercept(options, uni.switchTab);
    }
    navigateBack(options) {
        return uni.navigateBack(options);
    }
    beforeEach(guard) {
        if (!this.guards.includes(guard)) {
            this.guards.push(guard);
        }
    }
}
