import { retrieveLaunchData } from "@tma.js/sdk";
import { HashNavigator, type HashNavigatorOptions } from "@tma.js/sdk";
import { type Accessor, createSignal } from "solid-js";

export function createNavigator(): Accessor<HashNavigator> {
  const navigatorOptions: HashNavigatorOptions = {
    debug: true,
  };
  const [navigator, setNavigator] = createSignal<HashNavigator>(
    new HashNavigator([{}], 0, navigatorOptions),
  );

  // If page was reloaded, we assume that navigator had to previously save
  // its state in the session storage.
  if (retrieveLaunchData().isPageReload) {
    const stateRaw = sessionStorage.getItem("hash-navigator-state");
    if (stateRaw) {
      try {
        const { cursor, entries } = JSON.parse(stateRaw);
        setNavigator(new HashNavigator(entries, cursor, navigatorOptions));
      } catch (e) {
        console.error("Unable to restore hash navigator state.", e);
      }
    }

    console.log("RELOAD");
  }

  // In case, we could not restore its state, or it is the fresh start, we
  // can create empty navigator.
  // if (!navigator()) {
  //   setNavigator();
  // }

  const saveState = (nav: HashNavigator | undefined) => {
    if (!nav) {
      return;
    }
    sessionStorage.setItem(
      "hash-navigator-state",
      JSON.stringify({
        cursor: nav.cursor,
        entries: nav.getEntries(),
      }),
    );
  };

  // Whenever navigator changes its state, we save it in the session storage.
  navigator()?.on("change", ({ navigator: nav }) => saveState(nav));

  // Save initial state to make sure nothing will break when page will
  // be reloaded.
  saveState(navigator());

  return navigator;
}
