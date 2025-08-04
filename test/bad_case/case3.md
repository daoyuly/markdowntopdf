
### **Case 3：大图片导致溢出或 PDF 崩溃**

- **描述**：插入高分辨率图片导致 PDF 超宽或崩溃。
- **输入 Markdown**：

```markdown
![Big Image](https://example.com/ultra-hd-image.png)


预期行为：图片按版面缩放显示。

失败症状：页面超出边界、生成失败、或长时间卡住。