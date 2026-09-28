let seq = 0;

/**
 * 生成 WS clientId：时间戳保序 + 进程内序号保证同毫秒不重 + 随机数防多实例碰撞
 */
export function getUUID(): string {
	return `${Date.now().toString(36)}-${(seq++).toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
