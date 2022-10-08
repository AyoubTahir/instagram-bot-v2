import { promises } from "fs";

const loginBot = async (page, emailOrUsername, password) => {
  //load cookies
  const cookiesString = await promises.readFile("./cookies.json");
  const oldCookies = JSON.parse(cookiesString);
  await page.setCookie(...oldCookies);

  await page.goto("https://www.instagram.com/");

  //await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector("input[name='username']", { timeout: 5000 });

    await page.type("input[name='username']", emailOrUsername, {
      delay: 150,
    });

    await page.type("input[name='password']", password, {
      delay: 150,
    });
    await page.click("#loginForm button[type='submit']");
  } catch (err) {}

  await page.waitForTimeout(5000);

  const cookies = await page.cookies();
  console.log(cookies);
  await promises.writeFile("./cookies.json", JSON.stringify(cookies, null, 2));
};

export default loginBot;
