Case 7：Front Matter 元数据报错
描述：带有 YAML Front Matter 的文档被解析器误识。

输入 Markdown：

---
title: 测试文档
author: 张三
date: 2025-08-01
---

# 欢迎
这是正文内容。


预期行为：元信息被正确忽略或用于文档封面。

失败症状：PDF 生成报错或整段被误当正文。