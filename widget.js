/**
 * Configure API
 */
const API_URL = "";
const API_ID = "";
const API_TOKEN = "";

/**
 * Filter by Skipper Name
 */
const SKIPPER_NAME = args.widgetParameter ?? "Boris Herrmann";
const LOCALE = "de-DE";

const stringShortener = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
};

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

const getSkipper = async () => {
  return ranking.rankingEntries.find(
    (entry) => `${entry.firstName} ${entry.lastName}` === SKIPPER_NAME
  );
};
const skipper = await getSkipper();

const ww = new ListWidget();
ww.setPadding(1, 1, 1, 1);

const stackRoot = ww.addStack();
stackRoot.layoutVertically();

// Create a yellow-to-green gradient
const gradient = new LinearGradient();
gradient.colors = [
  new Color("#00274D"),
  new Color("#005B96"),
  new Color("#FFFFFF"),
]; // Deep blue to lighter ocean blue with white
gradient.locations = [0.0, 0.5, 1.0];
stackRoot.backgroundGradient = gradient; // Apply gradient to stackRoot

// Set padding and corner radius for better appearance
stackRoot.setPadding(12, 12, 12, 12);
stackRoot.cornerRadius = 16;

/**
 * STACK
 * Skipper Name
 */
const skipperNameStack = stackRoot.addStack();
skipperNameStack.layoutVertically();
const positionTitle = skipperNameStack.addText(`Position ${skipper.ranking}`);
positionTitle.font = Font.regularRoundedSystemFont(12); // Adjust font as needed
positionTitle.textColor = Color.white();

const skipperNameText = skipperNameStack.addText(
  `${skipper.firstName} ${skipper.lastName}`
);
skipperNameText.font = Font.boldRoundedSystemFont(16);
skipperNameText.textColor = Color.white();

stackRoot.addSpacer(3);

/**
 * STACK
 * Current Speed
 */
const speedStack = stackRoot.addStack();
speedStack.layoutVertically();

const speedTitle = speedStack.addText("Speed");
speedTitle.font = Font.regularRoundedSystemFont(12); // Adjust font as needed
speedTitle.textColor = Color.white();

const speedValue = speedStack.addText(skipper.speed);
speedValue.font = Font.boldRoundedSystemFont(16); // Adjust font as needed
speedValue.textColor = Color.white();

stackRoot.addSpacer(3);

/**
 * STACK
 * Distance to leader
 */
const distanceToLeaderStack = stackRoot.addStack();
distanceToLeaderStack.layoutVertically();

const distanceToLeaderTitle =
  distanceToLeaderStack.addText("Distance to leader");
distanceToLeaderTitle.font = Font.regularRoundedSystemFont(12); // Adjust font as needed
distanceToLeaderTitle.textColor = Color.white();

const distanceToLeaderValue = distanceToLeaderStack.addText(
  skipper.distanceToLeader
);
distanceToLeaderValue.font = Font.boldRoundedSystemFont(16); // Adjust font as needed
distanceToLeaderValue.textColor = Color.white();

stackRoot.addSpacer(3);

/**
 * STACK
 * Last Update
 */
const lastUpdateStack = stackRoot.addStack();
lastUpdateStack.layoutVertically();

const date = new Date(ranking.createdAt);

const lastUpdateTitle = lastUpdateStack.addText(
  `Updated at: ${new Intl.DateTimeFormat(LOCALE, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)}`
);
lastUpdateTitle.font = Font.regularRoundedSystemFont(8); // Adjust font as needed
lastUpdateTitle.textColor = Color.white();

ww.presentSmall();
// ww.presentMedium();
