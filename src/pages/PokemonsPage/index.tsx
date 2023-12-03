import { useNavigate } from "@solidjs/router";
import {
  For,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  type Input,
  array,
  nullable,
  number,
  object,
  parse,
  string,
} from "valibot";

import { Link } from "../../components/Link";
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
  front_default: nullable(string()),
  front_shiny: nullable(string()),
  front_female: nullable(string()),
  front_shiny_female: nullable(string()),
  back_default: nullable(string()),
  back_shiny: nullable(string()),
  back_female: nullable(string()),
  back_shiny_female: nullable(string()),
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
  height: number(),
  sprites: PokemonSpritesSchema,
  types: array(PokemonTypeSchema),
});

type PokemonDetail = Input<typeof PokemonDetailSchema>;

const PER_PAGE = 30;
const MAX_POKEMONS = 1292;

export function PokemonsPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = createSignal(0);
  const [fetchedPokemons] = createResource<PokemonDetail[], number>(
    currentPage,
    async (page) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${PER_PAGE}&offset=${
          page * PER_PAGE
        }`,
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
    },
  );

  return (
    <PageLayout>
      <Link
        class="block pb-3"
        href="/init-data"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Go back
      </Link>
      <Suspense>
        <Show when={fetchedPokemons()}>
          {(pokes) => (
            <For each={pokes()}>
              {(poke) => (
                <div>
                  <img
                    class="aspect-square h-12"
                    src={poke.sprites.front_default ?? undefined}
                  />
                  <div>{poke.name}</div>
                  <div> {poke.height}</div>
                  <div class="flex gap-1.5">
                    <For each={poke.types}>
                      {(info) => (
                        <span class="inline-block">{info.type.name}</span>
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          )}
        </Show>
      </Suspense>
    </PageLayout>
  );
}
