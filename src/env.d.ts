/// <reference types="vite/client"/>

// 全局环境声明文件（须保持全局脚本身份——无 import/export：
// 无类型第三方包的简写 declare module 'x'; 仅在全局脚本生效，模块身份文件中不生效）

// 环境变量
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// *.vue 组件声明已移除（2026-09-25）：vue-tsc 原生处理 .vue 文件类型无需 shim，
// 而 TS 6 下 declare module '*.vue' 触发「环境模块声明无法指定相对模块名」IDE 告警

declare module 'lodash-es';

declare module 'crypto-js';
