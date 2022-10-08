import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
//import puppeteer from "puppeteer";
import loginBot from "./loginBot.js";
import extractUsers from "./extractUsers.js";
import {
  maxNumber,
  isElementExist,
  waitRandomSecondDelay,
  isElementExistWait,
  waitRandomMuniteDelay,
} from "./helper.js";
import followBot from "./followBot.js";
import commentBot from "./commentBot.js";
import dmBot from "./dmBot.js";

const testMode = false;

const emailOrUsername = "";
const accountUsername = "";
const password = "";

const linkOfLikersList = "https://www.instagram.com/p/CjS4R9LrwlE/liked_by/";
const numberOfUsersToExtract = 500;

const numberOfPrivateProfilesToFollow = 50;
const numberOfPrivateProfilesToDM = 30;
const numberOfProfilesToCommentOn = 35;

const acitivateCommenting = true;
const acitivateFollowing = true;
const acitivateDM = false;

const dmIfNotCommented = true;

const delayAfterFollow = { min: 40, max: 80 }; //by seconds

const delayAfterComment = { min: 1, max: 2 }; //by minutes

const delayBettwenProfiles = { min: 6, max: 10 }; //by minutes

const delayBettwenProfilesOnlyFollow = { min: 5, max: 7 }; //by minutes

let emo1 = String.fromCodePoint("0x" + "🙌".codePointAt(0).toString(16));
let emo2 = String.fromCodePoint("0x" + "✨".codePointAt(0).toString(16));
let emo3 = String.fromCodePoint("0x" + "⬆️".codePointAt(0).toString(16));
const commentMessages = [
  "Can you give me your feedback on this new digital budget planner? and grab a free weekly planner " +
    emo1 +
    " you can find it in my profile",

  "I would like to hear your thoughts about this new digital budget planner and get a free weekly planner " +
    emo1 +
    " you can find it in my bio",

  "Would you mind sharing your thoughts about this new digital budget planner with me? " +
    emo1 +
    " you can also grab a free weekly planner in my bio",

  "What do you think of this digital budget planner? " +
    emo1 +
    " (Free weekly planner available) you can find it in my profile",
  "Have you tried this digital budget planner? " +
    emo1 +
    " also, check out my profile for a free weekly planner",

  "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my bio",

  "In my bio, I have a link to a digital budget planner. " +
    emo1 +
    " Would you mind sharing your thoughts about it?",
];
const DMMessages = [
  "you seem to be interested in planners like me, so be sure to check out my weekly planner! You can grab it for free by clicking the link in my bio." +
    emo1,

  "I noticed that you're interested in planners, so I have included a link in my profile for you to download my weekly planner for free.",

  "I noticed you're interested in planners, you can get my free weekly planner " +
    emo2 +
    " from the link in my bio " +
    emo3 +
    ".",

  "if you are " +
    emo2 +
    " interested in planners like me, you'll love my free weekly planner. You can find it in my bio " +
    emo3 +
    ".",

  "it seems like you are interested in planners, " +
    emo2 +
    " consider checking out my free weekly planner, and I don't think you will be disappointed.",

  "you seem interested in planners " +
    emo2 +
    ", make sure to grab my free half-hour weekly planner, I think you'll love it. " +
    emo3 +
    " Link in my bio",

  "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my bio " +
    emo1,
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

  //Login to instagram account
  await loginBot(page, emailOrUsername, password);

  //Extract usernames from the giving link
  const likersList = await extractUsers(
    page,
    linkOfLikersList,
    numberOfUsersToExtract
  );

  let numberOfFollows = 0;
  let numberOfComments = 0;
  let numberOfDMs = 0;
  //Get max bettwen 3 numbers
  const numberOfProfilesToWorkOn = maxNumber(
    numberOfPrivateProfilesToFollow,
    numberOfPrivateProfilesToDM,
    numberOfProfilesToCommentOn
  );
  console.log("Start working on " + numberOfProfilesToWorkOn + " profiles");
  for (
    let j = 0;
    j < likersList.length && numberOfComments < numberOfProfilesToWorkOn;
    j++
  ) {
    await page.goto("https://www.instagram.com/" + likersList[j]);

    let followed = false;
    let isCommentd = false;
    let isDM = false;

    try {
      let isPrivateAccount = await isElementExistWait(
        page,
        "article[class='_aayp'] > div > div > div._ac7v._aang > div a",
        10000
      );
      console.log("privacy: " + isPrivateAccount);
      if (
        acitivateFollowing &&
        numberOfFollows < numberOfPrivateProfilesToFollow
      ) {
        //Following user
        if (await followBot(page)) {
          console.log(likersList[j] + " followed successfully");
          followed = true;
          numberOfFollows++;
          if (
            (acitivateCommenting && !isPrivateAccount) ||
            acitivateDM ||
            dmIfNotCommented
          ) {
            await waitRandomSecondDelay(
              page,
              delayAfterFollow,
              acitivateCommenting && !isPrivateAccount ? "comment" : "Dm"
            );
          }
        } else {
          console.log(likersList[j] + " Already followed");
          if (!acitivateCommenting && !acitivateDM) {
            continue;
          }
        }
      }

      if (
        acitivateCommenting &&
        numberOfComments < numberOfProfilesToCommentOn
      ) {
        if (!isPrivateAccount) {
          await page.waitForTimeout(3500);

          if (
            await commentBot(
              page,
              likersList[j],
              commentMessages,
              accountUsername,
              testMode
            )
          ) {
            numberOfComments++;
            isCommentd = true;
            console.log("Commented!!!");

            if (acitivateDM) {
              await waitRandomMuniteDelay(page, delayAfterComment, "Dm");
            }
          } else {
            console.log(
              "No comment for " + likersList[j] + "i already commented"
            );
            if (!acitivateDM) continue;
          }
        } else {
          console.log(
            "Can't comment on " + likersList[j] + " its a private account"
          );
        }
      }

      if (
        (acitivateDM || (isPrivateAccount && dmIfNotCommented)) &&
        numberOfDMs < numberOfPrivateProfilesToDM
      ) {
        await page.waitForTimeout(3000);

        if (await dmBot(page, likersList[j], DMMessages, testMode)) {
          numberOfDMs++;
          isDM = true;
          console.log("message sent!!!");
        } else {
          console.log("can't DM no user founded or already DM");
        }
      }
    } catch (error) {
      console.log("somthing wrong");
      continue;
    }

    console.log("--> " + numberOfFollows + " followed now");
    console.log("--> " + numberOfComments + " comments now");
    console.log("--> " + numberOfDMs + " dms sent now");

    if (followed & !isDM & !isCommentd) {
      await waitRandomMuniteDelay(
        page,
        delayBettwenProfilesOnlyFollow,
        "go to the next user"
      );
    } else if (isDM || isCommentd) {
      await waitRandomMuniteDelay(
        page,
        delayBettwenProfiles,
        "go to the next user"
      );
    } else console.log("nothing to do for this user skip");
  }

  console.log("finished!!!");
})();
