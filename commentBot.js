const commentBot = async (
  page,
  likerUser,
  commentMessages,
  accountUsername,
  testMode
) => {
  //click first post
  await page.click(
    "article[class='_aayp'] > div > div > div._ac7v._aang > div a"
  );

  await page.waitForSelector(
    "section[class=' _aaoe _ae5y _ae5z _ae62'] form textarea",
    { timeout: 3000 }
  );
  await page.waitForTimeout(4000);

  //check if already commented
  const commented = await checkIfCommentedBefore(page, accountUsername);

  if (!commented) {
    console.log("commenting on " + likerUser);
    await page.type(
      "section[class=' _aaoe _ae5y _ae5z _ae62'] form textarea",
      "@ " +
        likerUser +
        " " +
        commentMessages[Math.floor(Math.random() * commentMessages.length)],
      {
        delay: 200,
      }
    );
    if (!testMode) {
      await page.waitForTimeout(3000);
      await page.click(
        "section[class=' _aaoe _ae5y _ae5z _ae62'] form button._acan._acao._acas"
      );
    }
    //close post
    await page.waitForTimeout(3000);
    await page.click("div.x78zum5.x6s0dn4.xl56j7k.xdt5ytf svg");
    await page.waitForTimeout(3000);

    return true;
  }

  //close post
  await page.waitForTimeout(3000);
  await page.click("div.x78zum5.x6s0dn4.xl56j7k.xdt5ytf svg");
  await page.waitForTimeout(3000);

  return false;
};

const checkIfCommentedBefore = async (page, accountUsername) => {
  return await page.evaluate((accu) => {
    const allComments = document.querySelectorAll(
      "div._ae5q._ae5r._ae5s ul._a9z6._a9za ul._a9ym"
    );

    let usernames = [];

    for (let i = 0; i < allComments.length; i++) {
      usernames.push(allComments[i].querySelector("h3._a9zc span a").innerText);
    }

    return usernames.includes(accu);
  }, accountUsername);
};

export default commentBot;
