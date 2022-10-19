import puppeteerExtra from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import instaBot from "./index.js";
import pinterestBot from "./pinterest.js";

const emoji = [
  String.fromCodePoint("0x" + "🙌".codePointAt(0).toString(16)),
  String.fromCodePoint("0x" + "✨".codePointAt(0).toString(16)),
  String.fromCodePoint("0x" + "⬆️".codePointAt(0).toString(16)),
];

const accounts = [
  {
    testMode: false,
    emailOrUsername: "",
    accountUsername: "",
    password: "",
    cookiesFileName: "cookies",
    linkOfLikersList: "https://www.instagram.com/p/CjYgnyUAMLO/liked_by/",
    numberOfUsersToExtract: 1000,
    numberOfPrivateProfilesToFollow: 0,
    numberOfPrivateProfilesToDM: 10,
    numberOfProfilesToCommentOn: 30,
    acitivateCommenting: true,
    acitivateFollowing: true,
    acitivateDM: false,
    dmIfNotCommented: true, //will always dm if didnt comment
    alwaysFollowWhatYouHaveDMorCommented: true, //will always follow what you have dm or comment on even if you diseable following
    delayAfterFollow: { min: 40, max: 80 }, //by seconds
    delayAfterComment: { min: 1, max: 2 }, //by minutes
    delayBettwenProfiles: { min: 6, max: 10 }, //by minutes
    delayBettwenProfilesOnlyFollow: { min: 5, max: 7 }, //by minutes
    scrollWhileWaiting: true,
    commentMessages: [
      "Can you give me your feedback on this new digital budget planner? and grab a free weekly planner " +
        emoji[0] +
        " you can find it in my profile",

      "I would like to hear your thoughts about this new digital budget planner and get a free weekly planner " +
        emoji[0] +
        " you can find it in my bio",

      "Would you mind sharing your thoughts about this new digital budget planner with me? " +
        emoji[0] +
        " you can also grab a free weekly planner in my bio",

      "What do you think of this digital budget planner? " +
        emoji[0] +
        " (Free weekly planner available) you can find it in my profile",
      "Have you tried this digital budget planner? " +
        emoji[0] +
        " also, check out my profile for a free weekly planner",

      "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my bio",

      "In my bio, I have a link to a digital budget planner. " +
        emoji[0] +
        " Would you mind sharing your thoughts about it?",
    ],
    DMMessages: [
      "you seem to be interested in planners like me, so be sure to check out my weekly planner! You can grab it for free by clicking the link in my bio." +
        emoji[0],

      "I noticed that you're interested in planners, so I have included a link in my profile for you to download my weekly planner for free.",

      "I noticed you're interested in planners, you can get my free weekly planner " +
        emoji[1] +
        " from the link in my bio " +
        emoji[2] +
        ".",

      "if you are " +
        emoji[1] +
        " interested in planners like me, you'll love my free weekly planner. You can find it in my bio " +
        emoji[2] +
        ".",

      "it seems like you are interested in planners, " +
        emoji[1] +
        " consider checking out my free weekly planner, and I don't think you will be disappointed.",

      "you seem interested in planners " +
        emoji[1] +
        ", make sure to grab my free half-hour weekly planner, I think you'll love it. " +
        emoji[2] +
        " Link in my bio",

      "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my bio " +
        emoji[0],
    ],
  },
  {
    testMode: false,
    emailOrUsername: "",
    accountUsername: "",
    password: "",
    cookiesFileName: "cookies2",
    linkOfLikersList: "https://www.instagram.com/p/CjZAu7HKTM2/liked_by/",
    numberOfUsersToExtract: 1000,
    numberOfPrivateProfilesToFollow: 0,
    numberOfPrivateProfilesToDM: 10,
    numberOfProfilesToCommentOn: 20,
    acitivateCommenting: true,
    acitivateFollowing: true,
    acitivateDM: false,
    dmIfNotCommented: true, //will always dm if didnt comment
    alwaysFollowWhatYouHaveDMorCommented: true, //will always follow what you have dm or comment on even if you diseable following
    delayAfterFollow: { min: 40, max: 80 }, //by seconds
    delayAfterComment: { min: 1, max: 2 }, //by minutes
    delayBettwenProfiles: { min: 6, max: 10 }, //by minutes
    delayBettwenProfilesOnlyFollow: { min: 5, max: 7 }, //by minutes
    scrollWhileWaiting: true,
    commentMessages: [
      "grab a free weekly planner " +
        emoji[0] +
        " you can find it in my profile",

      "would you like to get a free weekly planner " +
        emoji[0] +
        " you can find it in my bio",

      "is digital planning something you are interested in?" +
        emoji[0] +
        " if so grab a free weekly planner in my bio",

      "What do you think about digital planning? " +
        emoji[0] +
        " if you are interested get your free weekly planner you can find it in my profile",
      "Have you tried digital planning? " +
        emoji[0] +
        " if yes check out my profile for a free weekly planner",

      "Have you ever considered digital planning? if yes check out my free weekly planner in my bio",

      "In my bio, I have a link to a weekly planner. " +
        emoji[0] +
        " you can get it for free",
    ],
    DMMessages: [
      "there. I wanted to quickly reach out and let you know that we have a 70% discount on a realy cool digital planner, i think you'll love it. " +
        emoji[0] +
        " Link in my bio",

      "It's my pleasure to let you know that we have a super cool digital planner on sale, you'll love it. " +
        emoji[0] +
        " Link in my bio",

      "this is just a quick note to let you know that we have a 70% discount on one of our favorite digital planners, i'm sure you'll love it. You can find it in my bio " +
        emoji[0] +
        "",

      "I just wanted to let you know that we have a wonderful digital planner on sale right now, which I'm happy to share with you. " +
        emoji[0] +
        " You can find it in my bio",
    ],
  },
];
const pinterestAccounts = [
  {
    manualMode: false,
    testMode: false,
    email: "",
    password: "",
    cookiesFileName: "pincookies",
    linkToExtarct: "https://www.pinterest.com/pin/344173596536362541/",
    numberOfUsersToExtract: 1000,
    numberOfProfilesToFollow: 10,
    numberOfProfilesToDM: 10,
    acitivateFollowing: true,
    acitivateDM: true,
    delayAfterFollow: { min: 40, max: 80 }, //by seconds
    delayBettwenProfiles: { min: 4, max: 7 }, //by minutes
    delayBettwenProfilesOnlyFollow: { min: 3, max: 5 },
    DMMessages: [
      "you seem to be interested in planners like me, so be sure to check out my weekly planner! You can grab it for free by clicking the link in my profile." +
        emoji[0],

      "I noticed that you're interested in planners, so I have included a link in my profile for you to download my weekly planner for free.",

      "I noticed you're interested in planners, you can get my free weekly planner " +
        emoji[1] +
        " from the link in my profile " +
        emoji[2] +
        ".",

      "if you are " +
        emoji[1] +
        " interested in planners like me, you'll love my free weekly planner. You can find it in my profile " +
        emoji[2] +
        ".",

      "it seems like you are interested in planners, " +
        emoji[1] +
        " consider checking out my free weekly planner, and I don't think you will be disappointed. Link in my profile",

      "you seem interested in planners " +
        emoji[1] +
        ", make sure to grab my free half-hour weekly planner, I think you'll love it. " +
        emoji[2] +
        " Link in my profile",

      "I was wondering if you would mind sharing your thoughts about this digital budget planner, check it out in my profile and grab my free half-hour weekly planner " +
        emoji[0],
    ],
  },
];

(async () => {
  puppeteerExtra.use(stealthPlugin());
  instaBot(accounts[0], puppeteerExtra);
  //instaBot(accounts[1], puppeteerExtra);
  //pinterestBot(pinterestAccounts[0], puppeteerExtra);
})();
/*
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}*/
