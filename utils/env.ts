// 环境地址切换（uni-app x 仅支持 NODE_ENV 两态，编译期摇树死分支）
const DEV_API = 'http://192.168.31.228:8085'
const DEV_WS = 'ws://192.168.31.228:8085/ws-connect'
const PROD_API = 'https://lihua.xyz/prod-api'
const PROD_WS = 'wss://lihua.xyz/ws-connect'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const BASE_API = process.env.NODE_ENV === 'development' ? DEV_API : PROD_API
export const WS_API = process.env.NODE_ENV === 'development' ? DEV_WS : PROD_WS
