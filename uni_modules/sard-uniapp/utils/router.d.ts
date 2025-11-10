interface RouterExtraOptions {
    query?: Record<string, any>;
}
interface Route {
    url: string;
    query?: Record<string, any>;
}
export interface PagesPath {
}
type ChangeOptionsUrl<T extends {
    url: string.PageURIString;
}> = Omit<T, 'url'> & {
    url: (string & {}) | PagesPath['path' extends keyof PagesPath ? 'path' : never];
};
type RouterGuard = (to: Route, from: Route) => boolean | undefined | null | void | string | Route | Promise<boolean | undefined | null | void | string | Route>;
export declare class Router {
    status: 'idle' | 'busy';
    guards: RouterGuard[];
    protected resolvePath(currentPath: string, path: string): string;
    protected parseQuery(url: string): {
        url: string;
        query?: Record<string, string>;
    };
    protected getPathQuery(currentPath: string, route: string | Route): {
        url: string;
        query: {
            [x: string]: any;
        };
    };
    protected makeUniRouteOptions(to: {
        url: string;
        query: Record<string, any>;
    }, options: any): any;
    protected intercept(options: {
        url: string;
        success?: (result: any) => void;
        fail?: (result: any) => void;
        complete?: (result: any) => void;
    } & RouterExtraOptions, action: (...args: any[]) => any): Promise<any>;
    navigateTo(options: ChangeOptionsUrl<UniApp.NavigateToOptions> & RouterExtraOptions): Promise<any>;
    redirectTo(options: ChangeOptionsUrl<UniApp.RedirectToOptions> & RouterExtraOptions): Promise<any>;
    reLaunch(options: ChangeOptionsUrl<UniApp.ReLaunchOptions> & RouterExtraOptions): Promise<any>;
    switchTab(options: ChangeOptionsUrl<UniApp.SwitchTabOptions>): Promise<any>;
    navigateBack(options: UniApp.NavigateBackOptions): Promise<any>;
    beforeEach(guard: RouterGuard): void;
}
export {};
