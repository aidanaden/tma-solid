import { SDKProvider, useSDKContext } from "@tma.js/sdk-solid";
import { Match, type ParentProps, Switch, createMemo } from "solid-js";

import { App } from "./App";

/**
 * Component which is responsible for controlling SDK init process.
 */
function DisplayGate(props: ParentProps) {
  const { loading, error } = useSDKContext();
  const errorMessage = createMemo<null | string>(() => {
    const err = error();

    if (!err) {
      return null;
    }

    return err instanceof Error ? err.message : "Unknown error";
  });

  return (
    <Switch fallback={props.children}>
      <Match when={errorMessage()}>
        <div class="mx-auto h-screen max-w-7xl flex flex-col items-center justify-center gap-2.5 px-3">
          <p>
            SDK was unable to initialize. Probably, current application is being
            used not in Telegram Web Apps environment.
          </p>
          <blockquote>
            <p class="px-4 py-3">{errorMessage()}</p>
          </blockquote>
        </div>
      </Match>
      <Match when={loading()}>
        <div>Loading..</div>
      </Match>
    </Switch>
  );
}

/**
 * Root component of the project.
 */
export function Root() {
  return (
    <SDKProvider
      // initOptions={{
      //   debug: true,
      //   cssVars: true,
      //   timeout: 1000,
      //   checkCompat: true,
      // }}
      options={{
        cssVars: true,
      }}
    >
      <DisplayGate>
        <App />
      </DisplayGate>
    </SDKProvider>
  );
}
