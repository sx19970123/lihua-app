#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 工具函数：将字符串转为大驼峰
function toPascalCase(str) {
  return str
    .split(/[-_ ]+/)      // 按 - _ 空格 分割
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

// 获取当前目录
const currentDir = process.cwd();

// 读取当前目录下所有文件
fs.readdir(currentDir, (err, files) => {
  if (err) {
    console.error('读取目录失败:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(currentDir, file);
    fs.stat(filePath, (err, stats) => {
      if (err) return;

      // 只处理 SVG 文件
      if (stats.isFile() && path.extname(file) === '.svg') {

        // 文件名（不含后缀）
        const baseName = path.basename(file, '.svg');

        // 上一级文件夹名
        const parentDirName = path.basename(path.dirname(filePath));

        // 转为大驼峰
        const newName = toPascalCase(baseName) + toPascalCase(parentDirName) + '.svg';

        const newFilePath = path.join(currentDir, newName);

        // 重命名
        fs.rename(filePath, newFilePath, err => {
          if (err) console.error('重命名失败:', err);
          else console.log(`${file} → ${newName}`);
        });
      }
    });
  });
});
