const extractUsers = async (page, linkToExtarct, numberOfUsersToExtract) => {
  await page.goto(linkToExtarct, {
    waitUntil: "load",
  });

  //pin
  await page.waitForSelector(
    "#__PWS_ROOT__ > div:nth-child(1) > div.appContent > div > div > div > div > div.Closeup.Module > div > div > div > div > div.m2F.zI7.iyn.Hsu > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div.Jea.jzS.zI7.iyn.Hsu > div > div > div.jzS.ujU.un8.C9i.TB_ > div:nth-child(3) > div > div > div > div.Shl.zI7.iyn.Hsu > div",
    { timeout: 5000 }
  );

  await page.click(
    "#__PWS_ROOT__ > div:nth-child(1) > div.appContent > div > div > div > div > div.Closeup.Module > div > div > div > div > div.m2F.zI7.iyn.Hsu > div > div > div > div > div > div > div > div > div:nth-child(2) > div > div.Jea.jzS.zI7.iyn.Hsu > div > div > div.jzS.ujU.un8.C9i.TB_ > div:nth-child(3) > div > div > div > div.Shl.zI7.iyn.Hsu > div"
  );

  console.log("Extracting usernames from the list");

  return await scrapeInfiniteScrollItems(page, numberOfUsersToExtract);
};

const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
  let items = [];

  try {
    while (itemTargetCount > items.length) {
      items = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll("div.XbT.XiG.lnZ.ujU.wsz.zI7.iyn.Hsu a")
        );
        return items.map((cleanedItem) => cleanedItem.href);
        /*.filter(
            (item) =>
              item.querySelector(
                "div._ab8w._ab94._ab97._ab9h._ab9k._ab9p._abb0._abcm button._acan._acap._acas"
              ) !== null
          )*/
      });

      await page.evaluate(
        "document.querySelector('body > div.NIm.MIw.QLY.Rym > div > div > div > div.ZHw.XiG.XbT._O1.SpV.OVX.rDA.jar.CCY > div > div.XbT.XiG.lnZ.ujU.wsz.zI7.iyn.Hsu').scrollTop += 500"
      );

      await page.waitForFunction(
        "document.querySelector('body > div.NIm.MIw.QLY.Rym > div > div > div > div.ZHw.XiG.XbT._O1.SpV.OVX.rDA.jar.CCY > div > div.XbT.XiG.lnZ.ujU.wsz.zI7.iyn.Hsu').scrollTop += 500",
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
        "ocument.querySelector('div.XbT.zI7.iyn.Hsu').children[0].scrollHeight"
      );
      await page.evaluate(
        "document.querySelector('div.XbT.zI7.iyn.Hsu').children[0].scrollTo(0,document.querySelector('div.XbT.zI7.iyn.Hsu').children[0].scrollHeight)"
      );
      await page.waitForFunction(
        `ocument.querySelector('div.XbT.zI7.iyn.Hsu').children[0].scrollHeight > ${previousHeight}`,
        { timeout: 5000 }
      );
      await page.waitForTimeout(2000);
    }
  } catch (err) {}

  console.log(items.length + " usernames extracted from followers List");

  return items;
};

export default extractUsers;
