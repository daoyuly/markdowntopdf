Case 5：emoji/特殊字符乱码
描述：包含 emoji 或 Unicode 字符的文档转 PDF 后乱码。

输入 Markdown：

This is awesome! 🎉✨💡


预期行为：PDF 中正确显示 emoji。

失败症状：emoji 显示为问号或乱码方块。