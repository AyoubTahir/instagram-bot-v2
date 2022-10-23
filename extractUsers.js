const extractUsers = async (page, linkOfLikersList, numberOfUsersToExtract) => {
  await page.goto(linkOfLikersList);

  await page.waitForTimeout(10000);

  console.log("Extracting usernames from the list");

  try {
    await page.waitForSelector("div._aano", { timeout: 5000 });
    return await scrapeInfiniteScrollItemsFollowers(
      page,
      numberOfUsersToExtract
    );
  } catch (err) {
    return await scrapeInfiniteScrollItems(page, numberOfUsersToExtract);
  }
};

const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
  let items = [];

  let previousHeight;

  try {
    while (itemTargetCount > items.length) {
      items = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll(
            "div[class='_ab8w  _ab94 _ab97 _ab9f _ab9k _ab9p  _ab9- _aba8 _abcm']"
          )
        );
        return items
          .filter(
            (item) =>
              item.querySelector(
                "div._ab8w._ab94._ab97._ab9h._ab9k._ab9p._abb0._abcm button._acan._acap._acas"
              ) !== null
          )
          .map(
            (cleanedItem) =>
              cleanedItem.querySelector("a div div div").innerText
          );
      });

      previousHeight = await page.evaluate(
        "document.documentElement.scrollHeight"
      );
      await page.evaluate(
        "window.scrollTo(0, document.documentElement.scrollHeight)"
      );
      await page.waitForFunction(
        `document.documentElement.scrollHeight > ${previousHeight}`,
        { timeout: 5000 }
      );
      await page.waitForTimeout(1000);
    }
  } catch (err) {}

  console.log(items.length + " username extracted");

  return items;
};

const scrapeInfiniteScrollItemsFollowers = async (page, itemTargetCount) => {
  let items = [];

  let previousHeight;

  try {
    while (itemTargetCount > items.length) {
      items = await page.evaluate(() => {
        const items = Array.from(
          document.querySelector("div._aano > div > div").children
        );
        return items
          .filter(
            (item) =>
              item.querySelector(
                "div._ab8w._ab94._ab97._ab9h._ab9k._ab9p._abb0._abcm button._acan._acap._acas"
              ) !== null
          )
          .map(
            (cleanedItem) =>
              cleanedItem.querySelector(
                "span._aacl._aaco._aacw._aacx._aad7._aade div"
              ).innerText
          );
      });

      previousHeight = await page.evaluate(
        "document.querySelector('div._aano').scrollHeight"
      );
      await page.evaluate(
        "document.querySelector('div._aano').scrollTo(0, document.querySelector('div._aano').scrollHeight)"
      );
      await page.waitForFunction(
        `document.querySelector('div._aano').scrollHeight > ${previousHeight}`,
        { timeout: 5000 }
      );
      await page.waitForTimeout(1000);
    }
  } catch (err) {}

  console.log(items.length + " usernames extracted from followers List");

  return items;
};

export default extractUsers;
