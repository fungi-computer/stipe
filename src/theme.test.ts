import { expect, test, vi } from "vitest";

import * as themeModule from "./theme.js";

type ThemeModuleWithRead = typeof themeModule & {
  getTheme?: (root?: HTMLElement) => string | null;
};

// SAFETY: these optional properties mirror the accepted Stipe API that this red test freezes before export.
const typedThemeModule = themeModule as ThemeModuleWithRead;

function createObserverFixture() {
  const observe = vi.fn<MutationObserver["observe"]>();
  const disconnect = vi.fn<MutationObserver["disconnect"]>();
  const construct =
    vi.fn<(callback: MutationCallback, instance: MutationObserver) => void>();
  class FakeMutationObserver implements MutationObserver {
    constructor(callback: MutationCallback) {
      construct(callback, this);
    }

    observe(target: Node, options?: MutationObserverInit): void {
      observe(target, options);
    }

    disconnect(): void {
      disconnect();
    }

    takeRecords(): MutationRecord[] {
      return [];
    }
  }

  const notify = (
    record: Pick<MutationRecord, "type" | "attributeName">,
  ): void => {
    const constructorCall = construct.mock.calls[0];
    if (!constructorCall) throw new Error("MutationObserver was not captured");
    const [callback, observer] = constructorCall;
    // SAFETY: this narrow record fake supplies the MutationRecord fields observed by subscribeTheme.
    callback([record as MutationRecord], observer);
  };

  return {
    MutationObserver: FakeMutationObserver,
    observe,
    disconnect,
    construct,
    notify,
  };
}

test("Stipe applies arbitrary themes through data-theme without storage or events", () => {
  const setAttribute = vi.fn<(name: string, value: string) => void>();
  const rootDispatchEvent = vi.fn<(event: Event) => boolean>();
  const ownerWindowDispatchEvent = vi.fn();
  const ownerLocalStorageSetItem = vi.fn();
  const ownerSessionStorageSetItem = vi.fn();
  const globalDispatchEvent = vi.fn();
  const globalLocalStorageSetItem = vi.fn();
  const globalSessionStorageSetItem = vi.fn();
  const globalWindow = {
    dispatchEvent: globalDispatchEvent,
    localStorage: { setItem: globalLocalStorageSetItem },
    sessionStorage: { setItem: globalSessionStorageSetItem },
  };
  const ownerWindow = {
    dispatchEvent: ownerWindowDispatchEvent,
    localStorage: { setItem: ownerLocalStorageSetItem },
    sessionStorage: { setItem: ownerSessionStorageSetItem },
  };
  const root: Pick<HTMLElement, "dispatchEvent" | "setAttribute"> = {
    dispatchEvent: rootDispatchEvent,
    setAttribute,
  };
  Object.assign(root, { ownerDocument: { defaultView: ownerWindow } });

  vi.stubGlobal("window", globalWindow);
  vi.stubGlobal("dispatchEvent", globalDispatchEvent);
  vi.stubGlobal("localStorage", globalWindow.localStorage);
  vi.stubGlobal("sessionStorage", globalWindow.sessionStorage);

  try {
    // SAFETY: this faithful fake implements the HTMLElement operations observed by applyTheme.
    themeModule.applyTheme("  midnight-moss  ", root as HTMLElement);

    expect(setAttribute).toHaveBeenCalledTimes(1);
    expect(setAttribute).toHaveBeenCalledWith("data-theme", "midnight-moss");
    expect(rootDispatchEvent).not.toHaveBeenCalled();
    expect(ownerWindowDispatchEvent).not.toHaveBeenCalled();
    expect(globalDispatchEvent).not.toHaveBeenCalled();
    expect(ownerLocalStorageSetItem).not.toHaveBeenCalled();
    expect(ownerSessionStorageSetItem).not.toHaveBeenCalled();
    expect(globalLocalStorageSetItem).not.toHaveBeenCalled();
    expect(globalSessionStorageSetItem).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

test("Stipe reads data-theme and remains safe without a DOM", () => {
  const getAttribute = vi.fn<(name: string) => string | null>(() => "moss");
  const root: Pick<HTMLElement, "getAttribute"> = { getAttribute };
  const windowDispatchEvent = vi.fn();
  const globalDispatchEvent = vi.fn();
  const localStorageSetItem = vi.fn();
  const sessionStorageSetItem = vi.fn();
  const ownerWindow = {
    dispatchEvent: windowDispatchEvent,
    localStorage: { setItem: localStorageSetItem },
    sessionStorage: { setItem: sessionStorageSetItem },
  };

  vi.stubGlobal("document", undefined);
  vi.stubGlobal("window", ownerWindow);
  vi.stubGlobal("dispatchEvent", globalDispatchEvent);
  vi.stubGlobal("localStorage", ownerWindow.localStorage);
  vi.stubGlobal("sessionStorage", ownerWindow.sessionStorage);

  try {
    const getTheme = typedThemeModule.getTheme;

    expect(getTheme).toBeDefined();

    // SAFETY: this faithful fake implements the HTMLElement operation observed by getTheme.
    expect(getTheme(root as HTMLElement)).toBe("moss");
    expect(getAttribute).toHaveBeenCalledTimes(1);
    expect(getAttribute).toHaveBeenCalledWith("data-theme");

    themeModule.applyTheme("midnight-moss");
    expect(getTheme()).toBeNull();

    expect(windowDispatchEvent).not.toHaveBeenCalled();
    expect(globalDispatchEvent).not.toHaveBeenCalled();
    expect(localStorageSetItem).not.toHaveBeenCalled();
    expect(sessionStorageSetItem).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllGlobals();
  }
});

test("Stipe subscribes only to data-theme mutations and disconnects idempotently", () => {
  const getAttribute = vi.fn<(name: string) => string | null>();
  const observerFixture = createObserverFixture();
  const { MutationObserver, observe, disconnect, construct, notify } =
    observerFixture;
  const ownerWindow = { MutationObserver };
  const root: Pick<HTMLElement, "getAttribute"> = { getAttribute };
  Object.assign(root, { ownerDocument: { defaultView: ownerWindow } });
  const listener = vi.fn<(theme: string) => void>();

  // SAFETY: this faithful fake implements the HTMLElement operation observed by subscribeTheme.
  const unsubscribe = themeModule.subscribeTheme(listener, root as HTMLElement);

  expect(construct).toHaveBeenCalledTimes(1);
  expect(observe).toHaveBeenCalledTimes(1);
  expect(observe).toHaveBeenCalledWith(root, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  notify({ type: "attributes", attributeName: "class" });
  expect(getAttribute).not.toHaveBeenCalled();
  expect(listener).not.toHaveBeenCalled();

  getAttribute.mockReturnValueOnce("moss");
  notify({ type: "attributes", attributeName: "data-theme" });
  expect(getAttribute).toHaveBeenCalledWith("data-theme");
  expect(listener).toHaveBeenCalledWith("moss");

  getAttribute.mockReturnValueOnce(null);
  notify({ type: "attributes", attributeName: "data-theme" });
  expect(getAttribute).toHaveBeenLastCalledWith("data-theme");
  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenLastCalledWith("moss");

  unsubscribe();
  unsubscribe();
  expect(disconnect).toHaveBeenCalledTimes(1);
});

test("Stipe subscribes through the global observer fallback for windowless roots", () => {
  const getAttribute = vi.fn<(name: string) => string | null>(() => "moss");
  const observerFixture = createObserverFixture();
  const { MutationObserver, observe, disconnect, construct, notify } =
    observerFixture;
  const root: Pick<HTMLElement, "getAttribute"> & {
    ownerDocument: Pick<Document, "defaultView">;
  } = {
    getAttribute,
    ownerDocument: { defaultView: null },
  };
  const listener = vi.fn<(theme: string) => void>();
  vi.stubGlobal("MutationObserver", MutationObserver);

  try {
    let unsubscribe: (() => void) | undefined;
    expect(() => {
      // SAFETY: this faithful detached-root fake implements only the HTMLElement operation observed by subscribeTheme.
      unsubscribe = themeModule.subscribeTheme(listener, root as HTMLElement);
    }).not.toThrow();
    expect(unsubscribe).toBeDefined();
    if (unsubscribe === undefined) {
      expect.fail("Detached-root subscription did not return an unsubscribe");
    }

    expect(construct).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    notify({ type: "attributes", attributeName: "data-theme" });
    expect(getAttribute).toHaveBeenCalledWith("data-theme");
    expect(listener).toHaveBeenCalledWith("moss");

    unsubscribe();
    unsubscribe();
    expect(disconnect).toHaveBeenCalledTimes(1);
  } finally {
    vi.unstubAllGlobals();
  }
});

test("Stipe ignores theme removal for string-only subscribers", () => {
  const getAttribute = vi.fn<(name: string) => string | null>(() => null);
  const observerFixture = createObserverFixture();
  const { MutationObserver, observe, construct, notify } = observerFixture;
  const ownerWindow = { MutationObserver };
  const root: Pick<HTMLElement, "getAttribute"> = { getAttribute };
  Object.assign(root, { ownerDocument: { defaultView: ownerWindow } });
  const listener = vi.fn<(theme: string) => void>();

  // SAFETY: this faithful fake implements the HTMLElement operation observed by subscribeTheme.
  const unsubscribe = themeModule.subscribeTheme(listener, root as HTMLElement);

  expect(construct).toHaveBeenCalledTimes(1);
  expect(observe).toHaveBeenCalledWith(root, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  notify({ type: "attributes", attributeName: "data-theme" });

  expect(getAttribute).toHaveBeenCalledWith("data-theme");
  expect(listener).not.toHaveBeenCalled();
  unsubscribe();
});

test("the shipped theme boundary accepts the curated list and rejects unshipped names", () => {
  expect(themeModule.STIPE_THEMES).toEqual([
    "light",
    "dark",
    "latte",
    "mocha",
    "readout",
    "readout-night",
    "field-guide",
    "field-guide-night",
    "embed",
    "embed-dark",
    "phosphor",
    "codec",
    "paper",
    "ember",
    "tide",
    "tape",
    "sunrise",
    "pirate-radio",
    "pirate-radio-night",
    "consulting",
    "consulting-ink",
    "consulting-night",
    "consulting-night-ink",
    "consulting-riso-latte",
    "consulting-riso-latte-ink",
    "consulting-riso-glomzy",
    "consulting-riso-glomzy-ink",
    "vishnu",
    "coin",
    "coin-night",
    "chamfer",
  ]);
  for (const theme of themeModule.STIPE_THEMES) {
    expect(themeModule.stipeThemeSchema.parse(theme)).toBe(theme);
  }
  for (const value of ["cupcake", "synthwave", "unknown", "", null, 1]) {
    expect(themeModule.stipeThemeSchema.safeParse(value).success).toBe(false);
  }
});
