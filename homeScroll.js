const homeScroll = async (page, delayArr) => {
  await page.goto("https://www.instagram.com/", { waitUntil: "load" });

  try {
    const notNow =
      "div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe > div > div > div._a9-z > button._a9--._a9_1";
    await page.waitForSelector(notNow, { timeout: 5000 });
    await page.click(notNow);
  } catch (error) {}

  const delay = getRndInteger(
    delayArr.min * 60 * 1000,
    delayArr.max * 60 * 1000
  );
  console.log(
    "Scrolling while waiting " +
      Math.round(delay / 60 / 1000) +
      " min to go to the next user"
  );

  const whenToStop = Date.now() + delay;

  let scrollCounter = 800;

  for (let i = 1; Date.now() < whenToStop; i++) {
    try {
      await page.evaluate((scCounter) => {
        window.scrollTo(0, scCounter);
      }, scrollCounter);
      scrollCounter = scrollCounter + 800;
    } catch (err) {
      console.log("can't scroll to post " + i);
    }
    await page.waitForTimeout(10000);
  }
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default homeScroll;
