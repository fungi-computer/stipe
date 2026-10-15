import {
  type PierreTreesStyleOptions,
  type TerminalPalette,
  type ThemeListener,
  applyTheme,
  getTheme,
  pierreTreesStyle,
  STIPE_GOOEY_FILTER,
  subscribeTheme,
  terminalPalette,
} from "@fungi.computer/stipe";
import type { ThemeListener as ThemeSubpathListener } from "@fungi.computer/stipe/theme";
import type { PierreTreesStyleOptions as PierreSubpathOptions } from "@fungi.computer/stipe/pierre/trees";

const options: PierreTreesStyleOptions = { compact: true };
const subpathOptions: PierreSubpathOptions = options;
const palette: TerminalPalette | undefined = terminalPalette("latte");
const listener: ThemeListener = (theme) => void theme;
const subpathListener: ThemeSubpathListener = listener;
const style = pierreTreesStyle(options);
const unsubscribe = subscribeTheme(listener);
const theme: string | null = getTheme();
applyTheme("latte");
void STIPE_GOOEY_FILTER;
void palette;
void style;
void subpathOptions;
void unsubscribe;
void subpathListener;
void theme;
