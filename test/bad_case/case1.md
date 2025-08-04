Case 1：表格渲染失败
描述：复杂嵌套表格在 PDF 中错位或无法渲染。

输入 Markdown：

| Name | Details |
|------|---------|
| John | Address:  
        - City: Tokyo  
        - Zip: 100-0001 |



预期行为：PDF 正确渲染多行单元格内容。

失败症状：内容溢出、换行失败或表格破裂。