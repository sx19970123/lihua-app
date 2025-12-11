/**
 * 测量文本宽度
 */
export function measureTextWidth(text: string, fontSize = 16, fontFamily = "sans-serif") {
  const ctx = uni.createCanvasContext("textMeasureCanvas")
  ctx.setFontSize(fontSize)
  ctx.font = `${fontSize}px ${fontFamily}`
  return ctx.measureText(text).width
}

/**
 * 截断到指定宽度（单行）并加省略号
 */
export function cutTextSingleLine(
  text: string,
  maxWidth: number,
  fontSize = 16,
  fontFamily = "sans-serif"
) {
  const ctx = uni.createCanvasContext("textMeasureCanvas")
  ctx.setFontSize(fontSize)
  ctx.font = `${fontSize}px ${fontFamily}`

  let current = ""
  let width = 0

  for (let i = 0; i < text.length; i++) {
    const next = current + text[i]
    width = ctx.measureText(next).width

    if (width > maxWidth) {
      return current + "…" // 超出 → 添加省略号
    }

    current = next
  }

  return current // 未超出直接返回
}

/**
 * 多行省略号
 */
export function cutTextMultiLine(
  text: string,
  maxWidth: number,
  maxLines: number,
  fontSize = 16,
  fontFamily = "sans-serif"
) {
  const ctx = uni.createCanvasContext("textMeasureCanvas")
  ctx.setFontSize(fontSize)
  ctx.font = `${fontSize}px ${fontFamily}`

  const lines: string[] = []
  let line = ""

  for (let i = 0; i < text.length; i++) {
    const next = line + text[i]

    if (ctx.measureText(next).width > maxWidth) {
      // 到达最大行数 → 最后一行加省略号
      if (lines.length + 1 === maxLines) {
        line = cutTextSingleLine(line + text.slice(i), maxWidth, fontSize, fontFamily)
        lines.push(line)
        return lines
      }

      lines.push(line)
      line = text[i] // 开始新行
    } else {
      line = next
    }
  }

  // 最后一行
  if (line) lines.push(line)

  return lines
}
