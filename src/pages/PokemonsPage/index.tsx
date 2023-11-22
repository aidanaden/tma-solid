import { Link, useNavigate } from "@solidjs/router";
import {
  createResource,
  Suspense,
  For,
  Show,
  createSignal,
  createMemo,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  object,
  string,
  number,
  nullable,
  array,
  parse,
  type Input,
} from "valibot";

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

const PokemonSpritesSchema = object({
  front_default: string(),
  front_shiny: string(),
  front_female: string(),
  front_shiny_female: string(),
  back_default: string(),
  back_shiny: string(),
  back_female: string(),
  back_shiny_female: string(),
});
const PokemonTypeSchema = object({
  slot: number(),
  type: object({
    name: string(),
    url: string(),
  }),
});

const PokemonDetailSchema = object({
  id: number(),
  name: string(),
  sprites: PokemonSpritesSchema,
  types: array(PokemonTypeSchema),
});

type PokemonDetail = Input<typeof PokemonDetailSchema>;

const PER_PAGE = 30;
const MAX_POKEMONS = 1292;

export function PokemonsPage() {
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = createSignal(0);
  const [fetchedPokemons] = createResource<PokemonDetail[], number>(
    currentPage,
    async (page) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${PER_PAGE}&offset=${
          page * PER_PAGE
        }`
      );
      const jsoned = await res.json();
      const parsed = parse(PokemonsResultSchema, jsoned).results;
      const promises = parsed.map(async (p) => {
        const r = await fetch(p.url);
        const j = await r.json();
        return parse(PokemonDetailSchema, j);
      });
      const results = await Promise.all(promises);
      return results;
    }
  );

  createEffect(() => {
    alert(
      JSON.stringify({
        page: currentPage(),
        fetched: fetchedPokemons(),
      })
    );
    console.log({
      page: currentPage(),
      fetched: fetchedPokemons(),
    });
  });

  return (
    <PageLayout>
      <Link
        class="pb-3 block"
        href="/init-data"
        onClick={(e) => {
          e.preventDefault();
          // navigate(-1);
        }}
      >
        Go back
      </Link>
      <Suspense>
        {/* <For each={fetchedPokemons()}>{(poke) => <div>{poke.name}</div>}</For> */}
        <Show when={fetchedPokemons()}>
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
