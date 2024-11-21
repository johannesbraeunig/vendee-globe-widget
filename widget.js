///<reference path="../index.d.ts" />

/**
 * Configure API
 */
const API_URL = "https://vendee-globe.fly.dev/ranking";
const API_ID = "";
const API_TOKEN = "";

/**
 * Filter by Skipper Name
 */
const SKIPPER_NAME = args.widgetParameter ?? "Boris Herrmann";
const LOCALE = "de-DE";

function createTextStack(
  rootStack,
  {
    title = "",
    text = "",
    titleFontSize = 12,
    textFontSize = 16,
    titleColor = Color.white(),
    textColor = Color.white(),
    icon = null,
    iconSize = 10,
    iconColor = titleColor,
  }
) {
  const stack = rootStack.addStack();
  stack.layoutVertically();

  // Create a horizontal stack for the title and icon
  const titleStack = stack.addStack();
  titleStack.layoutHorizontally();
  titleStack.centerAlignContent();

  // Add title text
  const titleText = titleStack.addText(title);
  titleText.font = Font.regularRoundedSystemFont(titleFontSize);
  titleText.textColor = titleColor;

  // Add icon if specified
  if (icon) {
    titleStack.addSpacer(4); // Add some spacing between the title and the icon
    const titleIcon = titleStack.addImage(SFSymbol.named(icon).image);
    titleIcon.imageSize = new Size(iconSize, iconSize);
    titleIcon.tintColor = iconColor;
  }

  // Add main text if provided
  if (text?.length > 0) {
    const mainText = stack.addText(text);
    mainText.font = Font.boldRoundedSystemFont(textFontSize);
    mainText.textColor = textColor;
  }
}

const stringShortener = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
};

// Fetch Data
const fetchData = async () => {
  let req = new Request(API_URL);
  req.method = "GET";
  req.headers = {
    "X-API-ID": API_ID,
    "X-API-TOKEN": API_TOKEN,
  };
  return await req.loadJSON();
};
const ranking = await fetchData();
const skipper = ranking.rankingEntries.find(
  (entry) => `${entry.firstName} ${entry.lastName}` === SKIPPER_NAME
);

const ww = new ListWidget();
ww.setPadding(1, 1, 1, 1);

const stackRoot = ww.addStack();
stackRoot.layoutVertically();

const gradient = new LinearGradient();
gradient.colors = [
  new Color("#00274D"),
  new Color("#005B96"),
  new Color("#FFFFFF"),
];
gradient.locations = [0.0, 0.5, 1.0];
stackRoot.backgroundGradient = gradient;

stackRoot.setPadding(12, 12, 12, 12);
stackRoot.cornerRadius = 16;

// Name
createTextStack(stackRoot, {
  title: `Position ${skipper.ranking}`,
  text: `${skipper.firstName} ${skipper.lastName}`,
  icon:
    skipper.positionChange === 0
      ? "arrow.right"
      : skipper.positionChange > 0
      ? "arrow.up"
      : "arrow.down",
  iconColor:
    skipper.positionChange === 0
      ? Color.green()
      : skipper.positionChange > 0
      ? Color.green()
      : Color.red(),
});
stackRoot.addSpacer(3);

// Speed
createTextStack(stackRoot, { title: `Speed`, text: `${skipper.speed}` });
stackRoot.addSpacer(3);

// Distance to leader
createTextStack(stackRoot, {
  title: "Distance to leader",
  text: `${skipper.distanceToLeader}`,
  icon:
    skipper.distanceToLeaderChange === 0
      ? "arrow.right"
      : skipper.distanceToLeaderChange > 0
      ? "arrow.up"
      : "arrow.down",
  iconColor:
    skipper.distanceToLeaderChange === 0
      ? Color.green()
      : skipper.distanceToLeaderChange > 0
      ? Color.green()
      : Color.red(),
});
stackRoot.addSpacer(3);

// Last update
const date = new Date(ranking.createdAt);
createTextStack(stackRoot, {
  title: `Updated at: ${new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)}`,
  titleFontSize: 8,
});

ww.presentSmall();
