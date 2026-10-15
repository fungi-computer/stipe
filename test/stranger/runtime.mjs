import {
  STIPE_GOOEY_FILTER,
  applyTheme,
  terminalPalette,
} from "@fungi.computer/stipe";
import { getTheme, subscribeTheme } from "@fungi.computer/stipe/theme";
import { pierreTreesStyle } from "@fungi.computer/stipe/pierre/trees";

if (!Object.isFrozen(STIPE_GOOEY_FILTER))
  throw new Error("Gooey filter is mutable");
if (STIPE_GOOEY_FILTER.alphaIntercept !== -9)
  throw new Error("Gooey filter missing");
if (terminalPalette("latte")?.background !== "#eff1f5")
  throw new Error("Terminal palette missing");
if (pierreTreesStyle()["--trees-item-height"] !== "32px")
  throw new Error("Pierre projection missing");
applyTheme("latte");
getTheme();
subscribeTheme(() => undefined)();
