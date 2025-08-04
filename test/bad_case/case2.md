Case 2：代码块高亮异常
描述：嵌套代码块语法错误导致样式丢失。

输入 Markdown：


```javascript
function test() {
  console.log("Hello world!");
}


- **预期行为**：PDF 中正确渲染 JavaScript 高亮。
- **失败症状**：整页无法生成，或代码格式错乱。
