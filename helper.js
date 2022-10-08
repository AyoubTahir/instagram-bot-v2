export const maxNumber = (v1, v2, v3) => {
  return Math.max(Math.max(v1, v2), v3);
};

export const isElementExist = async (page, element) => {
  return await page.$eval(element, () => true).catch(() => false);
};

export const isElementExistWait = async (page, element, time) => {
  try {
    await page.waitForSelector(element, { timeout: time });
    return false;
  } catch (err) {
    return true;
  }
};

export const waitRandomSecondDelay = async (page, delayArr, str) => {
  const delay = getRndInteger(delayArr.min * 1000, delayArr.max * 1000);
  console.log("waiting " + Math.round(delay / 1000) + "s to " + str);
  await page.waitForTimeout(delay);
};

export const waitRandomMuniteDelay = async (page, delayArr, str) => {
  const delay = getRndInteger(
    delayArr.min * 60 * 1000,
    delayArr.max * 60 * 1000
  );
  console.log("waiting " + Math.round(delay / 60 / 1000) + " min to " + str);
  await page.waitForTimeout(delay);
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
