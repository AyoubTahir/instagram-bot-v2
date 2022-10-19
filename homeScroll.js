const homeScroll = async () => {
  await page.goto("https://www.instagram.com/", { waitUntil: "load" });

  const whenToStop = Date.now() + 50000;

  for (let i = 1; i <= 5 && Date.now() < whenToStop; i++) {
    try {
      let selector =
        "div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abc0._abcm > div > div:nth-child(1) > :nth-child(" +
        i +
        ")";
      await page.waitForSelector(selector);
      await page.evaluate((sel) => {
        document.querySelector(sel).scrollIntoView({ behavior: "smooth" });
      }, selector);
    } catch (err) {}
    await page.waitForTimeout(10000);
  }
};

export default homeScroll;
