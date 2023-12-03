import type { Chat, User } from "@tma.js/sdk";
import { useInitData, useInitDataRaw } from "@tma.js/sdk-solid";
import { Match, Switch, createMemo } from "solid-js";

import { DisplayData, type Line } from "../../components/DisplayData";
import { Link } from "../../components/Link";
import { PageLayout } from "../../components/PageLayout";

function getUserLines(user: User): Line[] {
  const {
    id,
    isBot,
    isPremium,
    languageCode = undefined,
    lastName = undefined,
    firstName,
  } = user;

  return [
    ["ID", id.toString()],
    ["Last name", lastName],
    ["First name", firstName],
    ["Is bot", isBot ? "yes" : "no"],
    ["Is premium", isPremium ? "yes" : "no"],
    ["Language code", languageCode],
  ];
}

function getChatLines(chat: Chat): Line[] {
  const { id, title, type, username = undefined, photoUrl = undefined } = chat;

  return [
    ["ID", id.toString()],
    ["Title", title],
    ["Type", type],
    ["Username", username],
    ["Photo URL", photoUrl],
  ];
}

export function InitDataPage() {
  // const { initData, initDataRaw } = useSDK();
  const initData = useInitData();
  const initDataRaw = useInitDataRaw();
  const whenWithData = createMemo(() => {
    const typed = initData();
    const raw = initDataRaw();
    return typed && raw ? { typed, raw } : false;
  });

  return (
    <PageLayout>
      <Link class="block pb-3" href="/theme-params">
        To theme parameters
      </Link>
      <Link class="block pb-3" href="/pokemons">
        To pokemons
      </Link>
      <Switch
        fallback={
          "Current launch parameters don't contain init data information."
        }
      >
        <Match when={whenWithData()}>
          {(match) => {
            const lines = createMemo<Line[]>(() => {
              // const {
              //   authDate,
              //   chat,
              //   hash,
              //   canSendAfter,
              //   queryId,
              //   receiver,
              //   user,
              //   startParam,
              //   chatType,
              //   chatInstance,
              // } = match().typed;

              return [
                ["Raw", match().raw],
                ["Auth date", match().typed.authDate.toLocaleString()],
                ["Hash", match().typed.hash],
                [
                  "Can send after",
                  match().typed.canSendAfter
                    ? match().typed.canSendAfter!.toString()
                    : undefined,
                ],
                ["Query id", match().typed.queryId],
                ["Start param", match().typed.startParam],
                ["Chat type", match().typed.chatType],
                ["Chat instance", match().typed.chatInstance],
                [
                  "Receiver",
                  match().typed.receiver
                    ? getUserLines(match().typed.receiver!)
                    : undefined,
                ],
                [
                  "Chat",
                  match().typed.chat
                    ? getChatLines(match().typed.chat!)
                    : undefined,
                ],
                [
                  "User",
                  match().typed.user
                    ? getUserLines(match().typed.user!)
                    : undefined,
                ],
              ];
            });
            return <DisplayData title="Init data" lines={lines()} />;
          }}
        </Match>
      </Switch>
    </PageLayout>
  );
}
