// POW 挖矿 worker（微信小程序宿主）
// 核心算法与 src/components/captcha/pow/sha256.ts 同源（快路径版），两处修改须同步
const K = new Uint32Array([
	0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
const BLOCK = new Uint8Array(64);
const W = new Uint32Array(64);
// 单块压缩（POW 输入恒 ≤55 字节），轮末累加初始 H 后仅保留首字（匹配用）
const sha256FirstWord = function (len) {
	BLOCK.fill(0, len);
	BLOCK[len] = 0x80;
	const bitLen = len * 8;
	BLOCK[62] = (bitLen >>> 8) & 0xff;
	BLOCK[63] = bitLen & 0xff;
	for (let i = 0; i < 16; i++) {
		W[i] = ((BLOCK[i * 4] << 24) | (BLOCK[i * 4 + 1] << 16) | (BLOCK[i * 4 + 2] << 8) | BLOCK[i * 4 + 3]) >>> 0;
	}
	for (let i = 16; i < 64; i++) {
		const w15 = W[i - 15], w2 = W[i - 2];
		const s0 = (((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3)) >>> 0;
		const s1 = (((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10)) >>> 0;
		W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
	}
	let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, d = 0xa54ff53a;
	let e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;
	for (let i = 0; i < 64; i++) {
		const S1 = (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) >>> 0;
		const ch = ((e & f) ^ (~e & g)) >>> 0;
		const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
		const S0 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) >>> 0;
		const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
		const t2 = (S0 + maj) >>> 0;
		h = g; g = f; f = e; e = (d + t1) >>> 0;
		d = c; c = b; b = a; a = (t1 + t2) >>> 0;
	}
	return (a + 0x6a09e667) >>> 0;
};
// nonce 十进制串写入复用块，返回串长（免每轮字符串分配）
const writeNonce = function (offset, nonce) {
	if (nonce < 10) {
		BLOCK[offset] = 48 + nonce;
		return 1;
	}
	let digits = 0;
	let n = nonce;
	while (n > 0) {
		digits++;
		n = (n - n % 10) / 10;
	}
	n = nonce;
	for (let i = digits - 1; i >= 0; i--) {
		BLOCK[offset + i] = 48 + n % 10;
		n = (n - n % 10) / 10;
	}
	return digits;
};
// 挖一个解：sha256(salt + nonce) 前缀匹配（首字整数位比较，与 hex 前缀匹配等价）
const mineOne = function (saltHex, targetHex) {
	const bits = targetHex.length * 4;
	const saltLen = saltHex.length;
	const targetInt = parseInt(targetHex, 16);
	const shift = 32 - bits;
	for (let i = 0; i < saltLen; i++) {
		BLOCK[i] = saltHex.charCodeAt(i);
	}
	for (let nonce = 0; ; nonce++) {
		const len = saltLen + writeNonce(saltLen, nonce);
		if ((sha256FirstWord(len) >>> shift) === targetInt) {
			return nonce;
		}
	}
};
worker.onMessage(function (msg) {
	const nonce = mineOne(msg.saltHex, msg.targetHex);
	worker.postMessage({ index: msg.index, nonce: nonce });
});
