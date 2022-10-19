import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import homeScroll from "./homeScroll.js";
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

const instaBot = async (account, puppeteerExtra) => {
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
    /*userDataDir:
      "C://Users//Tahir Ayoub//AppData//Local//Google//Chrome//User Data",*/
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  //Login to instagram account
  await loginBot(
    page,
    account.emailOrUsername,
    account.password,
    account.cookiesFileName
  );

  //Extract usernames from the giving link
  const likersList = await extractUsers(
    page,
    account.linkOfLikersList,
    account.numberOfUsersToExtract
  );

  let numberOfFollows = 0;
  let numberOfComments = 0;
  let numberOfDMs = 0;
  //Get max bettwen 3 numbers
  const numberOfProfilesToWorkOn = maxNumber(
    account.numberOfPrivateProfilesToFollow,
    account.numberOfPrivateProfilesToDM,
    account.numberOfProfilesToCommentOn
  );

  console.log(
    "Start working on " +
      maxNumber(numberOfProfilesToWorkOn, likersList.length) +
      " profiles"
  );
  for (let j = 0; j < likersList.length; j++) {
    await page.goto("https://www.instagram.com/" + likersList[j]);

    let followed = false;
    let isCommentd = false;
    let isDM = false;
    let openFollow = false;

    try {
      let isPrivateAccount = await isElementExistWait(
        page,
        "article[class='_aayp'] > div > div > div._ac7v._aang > div a",
        10000
      );

      console.log("privacy: " + isPrivateAccount);

      if (
        !isPrivateAccount &&
        numberOfComments < account.numberOfProfilesToCommentOn &&
        account.alwaysFollowWhatYouHaveDMorCommented
      ) {
        openFollow = true;
      } else if (
        numberOfDMs < account.numberOfPrivateProfilesToDM &&
        account.alwaysFollowWhatYouHaveDMorCommented
      ) {
        openFollow = true;
      } else {
        openFollow = false;
      }

      if (
        (account.acitivateFollowing &&
          numberOfFollows < account.numberOfPrivateProfilesToFollow) ||
        openFollow
      ) {
        //Following user
        if (await followBot(page)) {
          console.log(likersList[j] + " followed successfully");
          followed = true;
          numberOfFollows++;
          if (
            (account.acitivateCommenting && !isPrivateAccount) ||
            account.acitivateDM ||
            account.dmIfNotCommented
          ) {
            await waitRandomSecondDelay(
              page,
              account.delayAfterFollow,
              account.acitivateCommenting && !isPrivateAccount
                ? "comment"
                : "Dm"
            );
          }
        } else {
          console.log(likersList[j] + " Already followed");
          if (!account.acitivateCommenting && !account.acitivateDM) {
            continue;
          }
        }
      }

      if (
        account.acitivateCommenting &&
        numberOfComments < account.numberOfProfilesToCommentOn
      ) {
        if (!isPrivateAccount) {
          await page.waitForTimeout(3500);

          if (
            await commentBot(
              page,
              likersList[j],
              account.commentMessages,
              account.accountUsername,
              account.testMode
            )
          ) {
            numberOfComments++;
            isCommentd = true;
            console.log("Commented!!!");

            if (account.acitivateDM) {
              await waitRandomMuniteDelay(
                page,
                account.delayAfterComment,
                "Dm"
              );
            }
          } else {
            console.log(
              "No comment for " + likersList[j] + "i already commented"
            );
            if (!account.acitivateDM) continue;
          }
        } else {
          console.log(
            "Can't comment on " + likersList[j] + " its a private account"
          );
        }
      }

      if (
        (account.acitivateDM ||
          (isPrivateAccount && account.dmIfNotCommented)) &&
        numberOfDMs < account.numberOfPrivateProfilesToDM
      ) {
        await page.waitForTimeout(3000);

        if (
          await dmBot(page, likersList[j], account.DMMessages, account.testMode)
        ) {
          numberOfDMs++;
          isDM = true;
          console.log("message sent!!!");
        } else {
          console.log("can't DM no user founded or already DM");
        }
      }
    } catch (error) {
      console.log("somthing wrong!!!! let's skip this one");
      continue;
    }

    console.log("--> " + numberOfFollows + " followed now");
    console.log("--> " + numberOfComments + " comments now");
    console.log("--> " + numberOfDMs + " dms sent now");
    console.log("*------------------***-------------------*\n");
    if (
      numberOfFollows >= account.numberOfPrivateProfilesToFollow &&
      numberOfComments >= account.numberOfProfilesToCommentOn &&
      numberOfDMs >= account.numberOfPrivateProfilesToDM
    ) {
      break;
    }

    if (followed & !isDM & !isCommentd) {
      if (!account.scrollWhileWaiting) {
        await waitRandomMuniteDelay(
          page,
          account.delayBettwenProfilesOnlyFollow,
          "go to the next user"
        );
      } else {
        await homeScroll(page, account.delayBettwenProfilesOnlyFollow);
      }
    } else if (isDM || isCommentd) {
      if (!account.scrollWhileWaiting) {
        await waitRandomMuniteDelay(
          page,
          account.delayBettwenProfiles,
          "go to the next user"
        );
      } else {
        await homeScroll(page, account.delayBettwenProfiles);
      }
    } else console.log("nothing to do for this user skip");
  }

  console.log("finished!!!");
};

export default instaBot;
