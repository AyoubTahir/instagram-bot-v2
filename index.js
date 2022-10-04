import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer";
import commentBot from "./listCommentbot.js";

const testMode = true;

const emailOrUsername = "";
const password = "";

const linkOfLikersList = "https://www.instagram.com/p/CiadT-rACEz/liked_by/";

const minDelayBettwenComments = 3; //by minutes
const maxDelayBettwenComments = 5; //by minutes

const commentMessages = [
  "Can you give me your feedback on this new digital budget planner? @tdigitalstudio",

  "I would like to hear your thoughts about this new digital budget planner @tdigitalstudio",

  "Would you mind sharing your thoughts about this new digital budget planner with me? @tdigitalstudio",

  "What do you think of this digital budget planner?  @tdigitalstudio",
];

(async () => {
  puppeteerExtra.use(stealthPlugin());
  const browser = await puppeteerExtra.launch({
    args: [
      "--start-maximized",
      /*"disable-gpu",
      "--disable-infobars",
      "--disable-extensions",
      "--ignore-certificate-errors"
      ,*/
    ],
    headless: false,
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
    executablePath:
      "C://Program Files//Google//Chrome//Application//chrome.exe",
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto("https://www.instagram.com/");

  await page.waitForSelector("input[name='username']");

  await page.type("input[name='username']", emailOrUsername, {
    delay: 150,
  });

  await page.type("input[name='password']", password, {
    delay: 150,
  });
  await page.click("#loginForm button[type='submit']");

  await page.waitForTimeout(5000);

  await page.goto(linkOfLikersList);

  await page.waitForTimeout(10000);

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

  let numberOfComments = 0;
  for (let j = 0; j < likersList.length && numberOfComments < 15; j++) {
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
        if (!testMode) {
          await page.waitForTimeout(3000);
          await page.click(
            "section[class=' _aaoe _ae5y _ae5z _ae62'] form button._acan._acao._acas"
          );
        }
        numberOfComments++;
        console.log("commenting on " + likersList[j] + "done");
      } else {
        console.log("No comment for" + likersList[j] + "i already commented");
        continue;
      }

      //close post
      await page.waitForTimeout(3000);
      await page.click("div.x78zum5.x6s0dn4.xl56j7k.xdt5ytf svg");
      await page.waitForTimeout(3000);
    } catch (error) {
      console.log(
        "Can't comment on " + likersList[j] + " its private accounts"
      );
      continue;
    }

    const delay = getRndInteger(
      minDelayBettwenComments,
      maxDelayBettwenComments
    );

    //wait ? minute for the next one
    console.log("waiting " + delay + "min to comment on the next one");
    await page.waitForTimeout(delay * 60 * 1000);
  }

  //commentBot.commentFromListOfUsers(page, likersList, 15, commentMessages);
})();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
