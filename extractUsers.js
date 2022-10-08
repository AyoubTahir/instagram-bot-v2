const extractUsers = async (page, linkOfLikersList, numberOfUsersToExtract) => {
  await page.goto(linkOfLikersList);

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  console.log(await scrapeInfiniteScrollItems(page, numberOfUsersToExtract));

  await page.waitForTimeout(3000);

  console.log("Extracting usernames from the list");

  const likersList = await page.evaluate(() => {
    const allUsers = document.querySelectorAll(
      "div[class='_ab8w  _ab94 _ab97 _ab9f _ab9k _ab9p  _ab9- _aba8 _abcm']"
    );
    let likerUsernames = [];
    allUsers.forEach((user) => {
      likerUsernames.push(user.querySelector("a div div div").innerText);
    });
    return likerUsernames;
  });

  return likersList;
};

const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
  let items = [];

  let previousHeight;
  let previousItemsLength = 0;

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
          (cleanedItem) => cleanedItem.querySelector("a div div div").innerText
        );
    });

    if (previousItemsLength === items.length) break;
    previousItemsLength = items.length;

    console.log(items);

    previousHeight = await page.evaluate(
      "document.documentElement.scrollHeight"
    );
    await page.evaluate(
      "window.scrollTo(0, document.documentElement.scrollHeight)"
    );
    await page.waitForFunction(
      `document.documentElement.scrollHeight > ${previousHeight}`
    );
    await page.waitForTimeout(1000);
  }

  return items;
};

export default extractUsers;
