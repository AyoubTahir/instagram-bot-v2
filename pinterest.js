import loginBot from "./pinterest/loginBot.js";
import extractUsers from "./pinterest/extractUsers.js";
import { waitRandomMuniteDelay, waitRandomSecondDelay } from "./helper.js";

const pinterestBot = async (account, puppeteerExtra) => {
  const browser = await puppeteerExtra.launch({
    args: ["--start-maximized"],
    headless: false,
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
    executablePath:
      "C://Program Files//Google//Chrome//Application//chrome.exe",
  });

  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await loginBot(
    page,
    account.email,
    account.password,
    account.cookiesFileName
  );
  if (!account.manualMode) {
    const likersLinksList = await extractUsers(
      page,
      account.linkToExtarct,
      account.numberOfUsersToExtract
    );

    let numberOfFollows = 0;
    let numberOfDMs = 0;

    console.log(
      "Start working on " + likersLinksList.length + " PINTEREST profiles"
    );
    for (let j = 0; j < likersLinksList.length; j++) {
      await page.goto(likersLinksList[j], {
        waitUntil: "load",
      });

      let followed = false;
      let isDM = false;

      //Get profile name
      await page.waitForSelector(
        "div.gjz.jzS.un8.C9i.TB_ h1.lH1.dyH.iFc.H2s.R-d.O2T.tg7.IZT"
      );
      await page.waitForTimeout(5000);
      const profileName = await page.evaluate(() => {
        return document.querySelector(
          "div.gjz.jzS.un8.C9i.TB_ h1.lH1.dyH.iFc.H2s.R-d.O2T.tg7.IZT"
        ).innerText;
      });

      if (account.acitivateFollowing) {
        const isFollowing = await page.evaluate(() => {
          return (
            document.querySelector(
              "div.gjz.hs0.un8.tkf.TB_ div.Jea.XiG.zI7.iyn.Hsu button"
            ).innerText === "Following"
          );
        });

        if (!isFollowing) {
          try {
            await page.waitForSelector(
              "div.gjz.hs0.un8.tkf.TB_ div.Jea.XiG.zI7.iyn.Hsu button"
            );
            await page.waitForTimeout(3000);
            await page.click(
              "div.gjz.hs0.un8.tkf.TB_ div.Jea.XiG.zI7.iyn.Hsu button"
            );
            followed = true;
            numberOfFollows++;
            console.log(profileName + " followed");
            if (account.acitivateDM) {
              await waitRandomSecondDelay(page, account.delayAfterFollow, "Dm");
            }
          } catch (err) {
            console.log(" can't follow " + profileName);
            continue;
          }
        } else {
          console.log(profileName + " already followed ");
          continue;
        }
      }

      if (account.acitivateDM && followed) {
        try {
          for (let k = 0; k < 2; k++) {
            await page.waitForSelector(
              "div.gjz.hs0.un8.tkf.TB_ div.zI7.iyn.Hsu button"
            );
            await page.waitForTimeout(3000);
            await page.click("div.gjz.hs0.un8.tkf.TB_ div.zI7.iyn.Hsu button");

            //write message
            await page.waitForSelector(
              "div.Zr3.hUC.zI7.iyn.Hsu textarea.Gnj.Hsu.tBJ.dyH.iFc.sAJ.L4E.unP.iyn.Pve.pBj.qJc.aKM.LJB"
            );
            await page.waitForTimeout(3000);
            console.log("Sending DM to " + profileName);
            await page.type(
              "div.Zr3.hUC.zI7.iyn.Hsu textarea.Gnj.Hsu.tBJ.dyH.iFc.sAJ.L4E.unP.iyn.Pve.pBj.qJc.aKM.LJB",
              "Hi " +
                profileName +
                ", " +
                account.DMMessages[
                  Math.floor(Math.random() * account.DMMessages.length)
                ],
              {
                delay: 150,
              }
            );

            await page.waitForTimeout(3000);
            //send message
            if (!account.testMode) {
              await page.click(
                "div.Zr3.hUC.zI7.iyn.Hsu button.RCK.Hsu.USg.adn.CCY.gn8.L4E.kVc.oRi.lnZ.wsz.YbY"
              );
            }
            await page.waitForTimeout(3000);
          }
          numberOfDMs++;
          isDM = true;
          console.log("message sent successfully!!!!");
        } catch (err) {
          console.log(" can't DM " + profileName);
        }
      }

      console.log("--> " + numberOfFollows + " followed now on pinterest");
      console.log("--> " + numberOfDMs + " dms sent now on pinterest");
      console.log("*------------------***-------------------*\n");

      if (
        numberOfFollows >= account.numberOfProfilesToFollow &&
        account.acitivateFollowing &&
        numberOfDMs >= account.numberOfProfilesToDM
      ) {
        break;
      }

      if (isDM) {
        await waitRandomMuniteDelay(
          page,
          account.delayBettwenProfiles,
          "go to the next pinterest profile"
        );
      } else if (followed) {
        await waitRandomMuniteDelay(
          page,
          account.delayBettwenProfilesOnlyFollow,
          "go to the next pinterest profile"
        );
      } else {
        console.log("nothing to do for this pinterest profile let's skip it");
      }
    }
    console.log("finished from pinterest!!!");
  } else {
    console.log("manual mode activated!!!!");
  }
};

export default pinterestBot;
