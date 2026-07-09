import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf():
    html_path = r"C:\Users\Administrator\Desktop\b96b98f4bdf143c3b57069f6f5a6dcbe\knowledge-base-platform-architecture-and-sitemap.html"
    pdf_path = r"C:\Users\Administrator\Desktop\b96b98f4bdf143c3b57069f6f5a6dcbe\knowledge-base-platform-architecture-and-sitemap.pdf"
    
    async with async_playwright() as p:
        # 启动浏览器
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # 设置视口大小
        await page.set_viewport_size({"width": 1200, "height": 800})
        
        # 加载HTML文件
        file_url = f"file:///{html_path.replace(os.sep, '/')}"
        print(f"Loading: {file_url}")
        await page.goto(file_url)
        
        # 等待Mermaid图表渲染完成
        print("Waiting for Mermaid diagrams to render...")
        await page.wait_for_timeout(5000)  # 等待5秒让Mermaid完全渲染
        
        # 确保所有Mermaid图表都已渲染
        await page.wait_for_selector(".mermaid svg", timeout=30000)
        
        # 额外等待确保所有图表完成
        await page.wait_for_timeout(2000)
        
        print("Generating PDF...")
        # 生成PDF
        await page.pdf(
            path=pdf_path,
            format="A4",
            margin={"top": "20mm", "right": "15mm", "bottom": "20mm", "left": "15mm"},
            print_background=True,
            prefer_css_page_size=False
        )
        
        await browser.close()
        print(f"PDF generated successfully: {pdf_path}")
        return pdf_path

if __name__ == "__main__":
    asyncio.run(generate_pdf())
