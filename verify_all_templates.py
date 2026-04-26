import asyncio
from playwright.async_api import async_playwright
import os

async def verify_template(page, filename):
    print(f"Verifying {filename}...")
    filepath = f"file://{os.getcwd()}/{filename}"
    await page.goto(filepath)
    await page.wait_for_timeout(2000)  # Wait for map/scripts

    # Check if 4-step nav exists
    steps = await page.query_selector_all("button[id^='step-nav-']")
    if len(steps) >= 4:
        print(f"  [OK] 4-step navigation found.")
    else:
        print(f"  [ERROR] Steps found: {len(steps)}")

    # Take screenshot
    screenshot_path = f"/home/jules/verification/{filename}.png"
    await page.screenshot(path=screenshot_path, full_page=True)
    print(f"  [OK] Screenshot saved to {screenshot_path}")

async def main():
    if not os.path.exists("/home/jules/verification"):
        os.makedirs("/home/jules/verification")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})

        templates = [
            "E1_standard_malaga_taxi.html",
            "E2_airport_transfer_malaga.html",
            "E3_limousine_malaga.html",
            "E4_business_malaga.html",
            "E5_group_shuttle_malaga.html"
        ]

        for t in templates:
            await verify_template(page, t)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
