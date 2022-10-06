import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import puppeteer from "puppeteer";
import commentBot from "./listCommentbot.js";

const testMode = false;

const emailOrUsername = "";
const accountUsername = "";
const password = "";

const linkOfLikersList = "";

const numberOfPrivateProfilesToFollow = 10;
const numberOfProfilesToCommentOn = 15; //Always follow the porfile that you comment on

const acitivateCommenting = true;
const acitivateFollowing = true;

const minDelayBettwenFollowAndComment = 60; //by seconds
const maxDelayBettwenFollowAndComment = 180; //by seconds

const minDelayBettwenUsersJustComment = 15; //by minutes
const maxDelayBettwenUsersJustComment = 20; //by minutes

const minDelayBettwenUsersJustFollow = 3; //by minutes
const maxDelayBettwenUsersJustFollow = 5; //by minutes

let hex = "🙌".codePointAt(0).toString(16);
let emo = String.fromCodePoint("0x" + hex);
const commentMessages = [
  "Can you give me your feedback on this new digital budget planner? and grab a free weekly planner " +
    emo +
    " you can find it in my profile",

  "I would like to hear your thoughts about this new digital budget planner and get a free weekly planner " +
    emo +
    " you can find it in my bio",

  "Would you mind sharing your thoughts about this new digital budget planner with me? " +
    emo +
    " you can also grab a free weekly planner in my bio",

  "What do you think of this digital budget planner? " +
    emo +
    " (Free weekly planner available) you can find it in my profile",
  "Have you tried this digital budget planner? " +
    emo +
    " also, check out my profile for a free weekly planner",

  "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my bio",

  "In my bio, I have a link to a digital budget planner. " +
    emo +
    " Would you mind sharing your thoughts about it?",
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

  //await page.waitForNavigation({ waitUntil: "domcontentloaded" });

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
  let numberOfFollows = 0;
  console.log(
    "Start working on " +
      Math.max(numberOfPrivateProfilesToFollow, numberOfProfilesToCommentOn) +
      " profiles"
  );
  for (
    let j = 0;
    j < likersList.length &&
    numberOfComments <
      Math.max(numberOfPrivateProfilesToFollow, numberOfProfilesToCommentOn);
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
    let followed = false;
    try {
      //after search click in the dropdown menu
      //await page.waitForSelector("._abnx._aeul > div a");
      //await page.waitForTimeout(3000);
      //await page.click("._abnx._aeul > div a");

      if (
        acitivateFollowing &&
        numberOfFollows < numberOfPrivateProfilesToFollow
      ) {
        try {
          await page.waitForSelector(
            "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas"
          );
          await page.waitForTimeout(3000);
          //click folow
          await page.click(
            "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas"
          );
          console.log(likersList[j] + " followed successfully");
          followed = true;
          numberOfFollows++;
        } catch (err) {
          console.log(likersList[j] + " Already followed");
          if (!acitivateCommenting) {
            continue;
          }
        }

        let isPrivateAccount = await page
          .$eval(
            "article[class='_aayp'] > div > div > div._ac7v._aang > div a",
            () => true
          )
          .catch(() => false);

        if (acitivateCommenting && followed && isPrivateAccount) {
          const delayBettwenFollowAndComment = getRndInteger(
            minDelayBettwenFollowAndComment * 1000,
            maxDelayBettwenFollowAndComment * 1000
          );
          console.log(
            "waiting " +
              Math.round(delayBettwenFollowAndComment / 1000) +
              "s to comment"
          );
          await page.waitForTimeout(delayBettwenFollowAndComment);
        }
      }

      if (
        acitivateCommenting &&
        numberOfComments < numberOfProfilesToCommentOn
      ) {
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
        const commented = await page.evaluate((accu) => {
          const allComments = document.querySelectorAll(
            "div._ae5q._ae5r._ae5s ul._a9z6._a9za ul._a9ym"
          );

          let usernames = [];

          for (let i = 0; i < allComments.length; i++) {
            usernames.push(
              allComments[i].querySelector("h3._a9zc span a").innerText
            );
          }

          return usernames.includes(accu);
        }, accountUsername);
        console.log(commented + " " + accountUsername);
        if (!commented) {
          let doubleCheckNeedFollow = await page
            .$eval(
              "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas",
              () => true
            )
            .catch(() => false);
          if (doubleCheckNeedFollow) {
            await page.click(
              "div._ab8w._ab94._ab99._ab9f._ab9k._ab9p._abb3._abcm button._acan._acap._acas"
            );
            console.log(likersList[j] + " followed successfully");

            const delayBettwenFollowAndComment = getRndInteger(
              minDelayBettwenFollowAndComment * 1000,
              maxDelayBettwenFollowAndComment * 1000
            );
            console.log(
              "waiting " +
                Math.round(delayBettwenFollowAndComment / 1000) +
                "s to comment"
            );
            await page.waitForTimeout(delayBettwenFollowAndComment);
          }

          console.log("commenting on " + likersList[j]);
          await page.type(
            "section[class=' _aaoe _ae5y _ae5z _ae62'] form textarea",
            /*"@" +
              likersList[j] +
              " " +*/
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
          console.log("done");
        } else {
          console.log(
            "No comment for " + likersList[j] + "i already commented"
          );
          continue;
        }

        //close post
        await page.waitForTimeout(3000);
        await page.click("div.x78zum5.x6s0dn4.xl56j7k.xdt5ytf svg");
        await page.waitForTimeout(3000);
      }
    } catch (error) {
      console.log(
        "Can't comment on " + likersList[j] + " its a private account"
      );
      if (followed) {
        const delayAfterFollow = getRndInteger(
          minDelayBettwenUsersJustFollow * 60 * 1000,
          maxDelayBettwenUsersJustFollow * 60 * 1000
        );

        //wait ? minute for the next one
        console.log(
          "waiting " +
            Math.round(delayAfterFollow / 1000 / 60) +
            " min for the next user"
        );
        await page.waitForTimeout(delayAfterFollow);
      }
      continue;
    }

    const delay = getRndInteger(
      minDelayBettwenUsersJustComment * 60 * 1000,
      maxDelayBettwenUsersJustComment * 60 * 1000
    );

    //wait ? minute for the next one
    console.log(
      "waiting " + Math.round(delay / 1000 / 60) + " min for the next user"
    );
    await page.waitForTimeout(delay);
  }

  //commentBot.commentFromListOfUsers(page, likersList, 15, commentMessages);
})();

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
