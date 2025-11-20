import fs from 'fs'
import path from 'path'

/**
 * 加载图标目录
 * 在assets/icons下的css，生成icons.json文件
 * 组件中读取此文件，用于图标选择组件
 */
const buildIcons = () => {
	console.info("准备生成icons.json文件...")
	
	// 图标css目录
	const iconsDir = path.resolve(__dirname, '../src/assets/icons')
	// 生成的文件
	const outFile = path.resolve(__dirname, '../src/assets/icons/icons.json')
	// 文件名
	const iconNames : string[] = []
	// 读取到目标文件
	const files = fs.readdirSync(iconsDir)
	// 拿到所有css文件
	for (const file of files) {
		if (file.endsWith('.css')) {
			const content = fs.readFileSync(path.join(iconsDir, file), 'utf-8')
			// 匹配 .icon-xxx 形式
			const matches = content.match(/\.icon-[a-zA-Z0-9-_]+/g)
			if (matches) {
				matches.forEach(m => {
					const name = m.replace('.', '')
					if (!iconNames.includes(name)) {
						iconNames.push(name)
					}
				})
			}
		}
	}

	// 排序写入到文件
	iconNames.sort()
	fs.writeFileSync(outFile, JSON.stringify(iconNames, null, 2), 'utf-8')
	
	console.info(`icons.json 已生成，共 ${iconNames.length} 个图标`)
}

/**
 * 在 assets/icons下生成icons.json
 * 供组件内引用
 */ 
export const IconBuildPlugin = () => {
  return {
    name: 'auto-build-icons',
    buildStart() {
      buildIcons()
    }
  }
}