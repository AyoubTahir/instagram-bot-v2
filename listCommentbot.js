export default async function (
  page,
  likersList,
  MaxNumberOfComments,
  commentMessages
) {
  let numberOfComments = 0;
  for (
    let j = 0;
    j < likersList.length && numberOfComments < MaxNumberOfComments;
    j++
  ) {
    // delete value before search
    /*const inputValue = await page.$eval(
          "._aawf._aawg._aexm input",
          (el) => el.value
        );
        await page.click("._aawf._aawg._aexm input");
        for (let k = 0; k < inputValue.length; k++) {
          await page.keyboard.press("Backspace");
          await page.waitForTimeout(100);
        }*/

    //type username in search bar
    /*await page.type("._aawf._aawg._aexm input", likersList[j], {
          delay: 200,
        });*/
    await page.goto("https://www.instagram.com/" + likersList[j]);
    try {
      //after search click in the dropdown menu
      //await page.waitForSelector("._abnx._aeul > div a");
      //await page.waitForTimeout(3000);
      //await page.click("._abnx._aeul > div a");

      await page.waitForSelector(
        "article[class='_aayp'] > div > div > div._ac7v._aang > div a",
        getRndInteger(4000, 6000)
      );
      await page.waitForTimeout(3500);

      //click first post
      await page.click(
        "article[class='_aayp'] > div > div > div._ac7v._aang > div a"
      );

      await page.waitForSelector(
        "section[class=' _aaoe _ae5y _ae5z _ae62'] form textarea",
        getRndInteger(4000, 6000)
      );
      await page.waitForTimeout(4000);

      //check if already commented
      const commented = await page.evaluate(() => {
        const allComments = document.querySelectorAll(
          "div._ae5q._ae5r._ae5s ul._a9z6._a9za ul._a9ym"
        );

        let usernames = [];

        for (let i = 0; i < allComments.length; i++) {
          usernames.push(
            allComments[i].querySelector("h3._a9zc span a").innerText
          );
        }

        return usernames.includes("fordigitalplanners");
      });

      if (!commented) {
        await page.type(
          "section[class=' _aaoe _ae5y _ae5z _ae62'] form textarea",
          "@" +
            likersList[j] +
            " " +
            commentMessages[Math.floor(Math.random() * commentMessages.length)],
          {
            delay: 200,
          }
        );
        /*
        await page.waitForTimeout(3000);
        await page.click(
          "section[class=' _aaoe _ae5y _ae5z _ae62'] form button._acan._acao._acas"
        );*/
        numberOfComments++;
        console.log("commenting on " + likersList[j] + "done");
      } else {
        console.log("No comment for" + likersList[j] + "i already commented");
        continue;
      }

      //close post
      await page.waitForTimeout(2000);
      await page.click("div.s8sjc6am.mczi3sny.pxtik7zl.b0ur3jhr");
    } catch (error) {
      console.log("Can't comment on private accounts");
      continue;
    }

    //wait 5 minute for the next one
    console.log(
      "waiting " +
        getRndInteger(180000, 300000) +
        "s to comment on the next one"
    );
    await page.waitForTimeout(getRndInteger(180000, 300000));
  }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
