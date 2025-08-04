import asyncio
from playwright.async_api import async_playwright
import os

# 测试页面 URL（可替换为你自己部署或测试的网址）
TEST_PAGE = "https://www.markdowntopdf.com"

# 测试用的 Markdown 样本
CASES = {
    "style_lost": "# 标题1\n## 子标题\n- 项目1\n- 项目2",
    "image_broken": "![不存在图片](https://example.com/image-not-exist.png)",
    "code_block_error": "```python\nprint('Hello World')\n```",
    "emoji_fail": "# 欢迎 😊",
    "long_content": "# 长内容\n" + "\n".join(["这是第 %d 行" % i for i in range(1, 500)]),
}

# 存储生成的 PDF 路径
OUTPUT_DIR = "pdf_outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)


async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(TEST_PAGE)

        for case_name, markdown_text in CASES.items():
            print(f"测试用例：{case_name}")

            # 假设网页有一个输入框可编辑 Markdown 内容，并点击按钮生成 PDF
            await page.fill("textarea", markdown_text)

            # 点击“转换为PDF”按钮（请替换为你网页中实际的selector）
            await page.click("text=Convert to PDF")

            # 等待下载/渲染完成
            await page.wait_for_timeout(3000)

            # 保存 PDF（以 page.pdf 的方式保存当前页面）
            pdf_path = os.path.join(OUTPUT_DIR, f"{case_name}.pdf")
            await page.pdf(path=pdf_path)

            print(f"已保存：{pdf_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_test())
