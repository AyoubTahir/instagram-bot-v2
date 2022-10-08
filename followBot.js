const followBot = async (page) => {
  try {
    await page.waitForSelector(
      "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas",
      { timeout: 3000 }
    );
    await page.waitForTimeout(3000);
    //click folow
    await page.click(
      "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas"
    );

    return true;
  } catch (err) {
    return false;
  }
};

export default followBot;
