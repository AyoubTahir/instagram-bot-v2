import { isElementExist } from "./helper.js";

const dmBot = async (page, likerUser, DMMessages, testMode) => {
  await page.goto("https://www.instagram.com/direct/inbox/");
  await page.waitForTimeout(5000);
  //document.querySelectorAll("div._ab5z._ab5_ > div div._ab8w._ab94._ab96._ab9f._ab9k._ab9p._abcm") check if already dm
  //"div._ab5z._ab5_ > div div._ab8w._ab94._ab96._ab9f._ab9k._ab9p._abcm
  try {
    //click Not now button
    await page.waitForSelector("button._a9--._a9_1", { timeout: 5000 });
    await page.waitForTimeout(3000);
    await page.click("button._a9--._a9_1");
  } catch (err) {}

  //click icon to start dm model
  await page.waitForSelector("div._aa4k div._aa4m._aa4p button._abl-._abm2");
  await page.waitForTimeout(3000);
  await page.click("div._aa4k div._aa4m._aa4p button._abl-._abm2");

  //Type username
  await page.waitForSelector("div._aag- div._aa2u input[name='queryBox']");
  await page.type("div._aag- div._aa2u input[name='queryBox']", likerUser, {
    delay: 150,
  });

  await page.waitForTimeout(5000);

  //check if user exsist
  const UsernamePosition = await checkIfUserExsist(page, likerUser);

  if (UsernamePosition > -1) {
    //click Founded Username
    await page.waitForSelector(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9o._ab9v._abcm > :nth-child(" +
        (UsernamePosition + 1) +
        ")"
    );
    await page.waitForTimeout(2000);
    await page.click(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9o._ab9v._abcm > :nth-child(" +
        (UsernamePosition + 1) +
        ")"
    );

    //Click next
    await page.waitForSelector(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9-._abcm button._acan._acao._acas._acav"
    );
    await page.waitForTimeout(2000);
    await page.click(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._ab9-._abcm button._acan._acao._acas._acav"
    );

    await page.waitForSelector("div._ab5z._ab5_ > div");
    await page.waitForTimeout(3000);

    //Check if already dm
    if (
      await isElementExist(
        page,
        "div._ab5z._ab5_ > div > div._ab8w._ab94._ab96._ab9f._ab9k._ab9p._abcm"
      )
    ) {
      return false;
    }

    console.log("messaging " + likerUser);
    //Type message
    await page.waitForSelector(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9o._abbh._abcm textarea"
    );
    await page.waitForTimeout(5000);
    await page.type(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9o._abbh._abcm textarea",
      "Hi, " /*
        likerUser +
        ", " +*/ + DMMessages[Math.floor(Math.random() * DMMessages.length)],
      {
        delay: 150,
      }
    );

    if (!testMode) {
      //send message
      await page.waitForSelector(
        "div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abbi._abcm button._acan._acao._acas"
      );
      await page.waitForTimeout(2000);
      await page.click(
        "div._ab8w._ab94._ab99._ab9f._ab9m._ab9p._abbi._abcm button._acan._acao._acas"
      );
    }
    return true;
  } else {
    return false;
  }
};

const alreadyDM = async (page) => {
  return await isElementExist(
    page,
    "div._ab5z._ab5_ > div > div._ab8w._ab94._ab96._ab9f._ab9k._ab9p._abcm"
  );
};

const checkIfUserExsist = async (page, likerUser) => {
  return await page.evaluate((accUser) => {
    const allUsers = document.querySelectorAll(
      "div._ab8w._ab94._ab99._ab9f._ab9m._ab9o._ab9v._abcm div._abm4 div._aacl._aaco._aacw._aacx._aad6"
    );

    for (let i = 0; i < allUsers.length; i++) {
      if (accUser === allUsers[i].innerText) {
        return i;
      }
    }

    return -1;
  }, likerUser);
};
export default dmBot;
