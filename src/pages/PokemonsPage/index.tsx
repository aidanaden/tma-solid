import { Link } from "@solidjs/router";
import { Switch, Match, createResource, Suspense, For, Show } from "solid-js";
import {
  object,
  string,
  number,
  nullable,
  array,
  parse,
  type Input,
} from "valibot";

import { Line, DisplayData } from "../../components/DisplayData";
import { PageLayout } from "../../components/PageLayout";

const ListPokemonSchema = object({
  name: string(),
  url: string(),
});
const PokemonsResultSchema = object({
  count: number(),
  next: string(),
  previous: nullable(string()),
  results: array(ListPokemonSchema),
});
type PokemonsResult = Input<typeof PokemonsResultSchema>;

export function PokemonsPage() {
  const [pokemons] = createResource<PokemonsResult["results"]>(async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon");
    const jsoned = await res.json();
    return parse(PokemonsResultSchema, jsoned).results;
  });

  return (
    <PageLayout>
      <Link class="pb-3 block" href="/theme-params">
        To theme parameters
      </Link>
      <Suspense>
        <Show when={pokemons()}>
          {(pokes) => (
            <For each={pokes()}>{(poke) => <div>{poke.name}</div>}</For>
          )}
        </Show>
      </Suspense>
      {/* <Switch
        fallback={
          "Current launch parameters don't contain init data information."
        }
      >
        <Match when={whenWithData()}>
          {(match) => {
            const lines = (): Line[] => {
              const {
                authDate,
                chat,
                hash,
                canSendAfter,
                queryId,
                receiver,
                user,
                startParam,
                chatType,
                chatInstance,
              } = match().typed;

              return [
                ["Raw", match().raw],
                ["Auth date", authDate.toLocaleString()],
                ["Hash", hash],
                [
                  "Can send after",
                  canSendAfter ? canSendAfter.toString() : null,
                ],
                ["Query id", queryId],
                ["Start param", startParam],
                ["Chat type", chatType],
                ["Chat instance", chatInstance],
                ["Receiver", receiver ? getUserLines(receiver) : null],
                ["Chat", chat ? getChatLines(chat) : null],
                ["User", user ? getUserLines(user) : null],
              ];
            };

            return <DisplayData title="Init data" lines={lines()} />;
          }}
        </Match>
      </Switch> */}
    </PageLayout>
  );
}
