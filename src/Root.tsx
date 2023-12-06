import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { persistQueryClient } from "@tanstack/solid-query-persist-client";
import { SDKProvider, useSDKContext } from "@tma.js/sdk-solid";
import { Match, Switch, createMemo, type ParentProps } from "solid-js";

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

const queryClient = new QueryClient();
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

/**
 * Root component of the project.
 */
export function Root() {
  return (
    <SDKProvider
      options={{
        cssVars: true,
      }}
    >
      <DisplayGate>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </DisplayGate>
    </SDKProvider>
  );
}
