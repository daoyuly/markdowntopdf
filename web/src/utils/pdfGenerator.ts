import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (markdownContent: string, filename: string): Promise<void> => {
  // 创建一个临时的div来渲染Markdown
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '0'
  tempDiv.style.width = '800px'
  tempDiv.style.padding = '40px'
  tempDiv.style.backgroundColor = 'white'
  tempDiv.style.fontFamily = 'Arial, sans-serif'
  tempDiv.style.fontSize = '12px'
  tempDiv.style.lineHeight = '1.6'
  tempDiv.style.color = '#333'
  
  document.body.appendChild(tempDiv)

  // 简单的Markdown渲染（不使用React）
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; font-weight: bold; margin-bottom: 8px; margin-top: 16px; color: #000;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 20px; font-weight: bold; margin-bottom: 12px; margin-top: 20px; color: #000;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; margin-top: 24px; color: #000;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 11px;">$1</code>')
      .replace(/\n\n/g, '</p><p style="margin-bottom: 12px; margin-top: 0;">')
      .replace(/^\n/, '<p style="margin-bottom: 12px; margin-top: 0;">')
      .replace(/\n$/, '</p>')
  }

  tempDiv.innerHTML = `<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #333;">
    ${renderMarkdown(markdownContent)}
  </div>`

  // 等待渲染完成
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // 使用html2canvas将内容转换为图片
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    // 创建PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4宽度
    const pageHeight = 295 // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // 如果内容超过一页，添加更多页
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // 下载PDF
    pdf.save(`${filename}.pdf`)
  } finally {
    // 清理临时元素
    document.body.removeChild(tempDiv)
  }
} 