import { promises } from "fs";

const loginBot = async (page, email, password, cookiesFileName) => {
  try {
    //load cookies
    const cookiesString = await promises.readFile(
      "./" + cookiesFileName + ".json"
    );
    const oldCookies = JSON.parse(cookiesString);
    await page.setCookie(...oldCookies);
    console.log("./" + cookiesFileName + ".json");
  } catch (err) {
    console.log("No data saved for pinterest need to login again!!!");
  }

  await page.waitForTimeout(3000);

  await page.goto("https://www.pinterest.com/", {
    waitUntil: "load",
  });

  try {
    await page.waitForSelector(
      "#fullpage-wrapper > div.section.fp-section.active.fp-table.fp-completely > div > div > div.QLY._he.zI7.iyn.Hsu > div > div.Eqh.gjz.hs0.un8.C9i.TB_ > div.wc1.zI7.iyn.Hsu > button",
      { timeout: 5000 }
    );

    await page.click(
      "#fullpage-wrapper > div.section.fp-section.active.fp-table.fp-completely > div > div > div.QLY._he.zI7.iyn.Hsu > div > div.Eqh.gjz.hs0.un8.C9i.TB_ > div.wc1.zI7.iyn.Hsu > button"
    );

    //type email
    await page.waitForSelector("div.XiG.zI7.iyn.Hsu input#email", {
      timeout: 5000,
    });

    await page.type("div.XiG.zI7.iyn.Hsu input#email", email, {
      delay: 150,
    });

    //type password
    await page.type("div.XiG.zI7.iyn.Hsu input#password", password, {
      delay: 150,
    });

    await page.waitForTimeout(2000);

    //login
    await page.click(
      "#__PWS_ROOT__ > div.zI7.iyn.Hsu > div > div:nth-child(4) > div > div > div > div > div > div:nth-child(4) > form > div:nth-child(7) > button"
    );
  } catch (err) {}

  await page.waitForTimeout(5000);

  const cookies = await page.cookies();
  await promises.writeFile(
    "./" + cookiesFileName + ".json",
    JSON.stringify(cookies, null, 2)
  );
};

export default loginBot;
