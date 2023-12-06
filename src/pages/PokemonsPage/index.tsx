import { noop, tryOnCleanup } from "@solid-primitives/utils";
import { useNavigate } from "@solidjs/router";
import { createInfiniteQuery, isServer } from "@tanstack/solid-query";
import { useThemeParams } from "@tma.js/sdk-solid";
import { For, Show, Suspense, onCleanup } from "solid-js";
import { array, nullable, number, object, parse, string } from "valibot";

import { Link } from "../../components/Link";
import { PageLayout } from "../../components/PageLayout";

export const PokemonType = {
  GRASS: "grass",
  POISON: "poison",
  FIRE: "fire",
  FLYING: "flying",
  WATER: "water",
  BUG: "bug",
  NORMAL: "normal",
  ELECTRIC: "electric",
  GROUND: "ground",
  FAIRY: "fairy",
  FIGHTING: "fighting",
  PSYCHIC: "psychic",
  ROCK: "rock",
  STEEL: "steel",
  ICE: "ice",
  GHOST: "ghost",
  DRAGON: "dragon",
  DARK: "dark",
} as const;
export type PokemonType = (typeof PokemonType)[keyof typeof PokemonType];

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

const PER_PAGE = 30;

export function PokemonsPage() {
  const themeParams = useThemeParams();
  const navigate = useNavigate();
  const pokemonsQuery = createInfiniteQuery(() => ({
    queryKey: ["pokemons"],
    queryFn: async (s) => {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?limit=${PER_PAGE}&offset=${
          s.pageParam * PER_PAGE
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
      if (results.length === 0) {
        return;
      }
      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
  }));

  let setEl: (el: Element) => void = noop;
  if (!isServer) {
    const io = new IntersectionObserver((e) => {
      if (
        e.length > 0 &&
        e[0]!.isIntersecting &&
        pokemonsQuery.hasNextPage &&
        !pokemonsQuery.isFetchingNextPage
      ) {
        pokemonsQuery.fetchNextPage();
      }
    });
    onCleanup(() => io.disconnect());
    setEl = (el: Element) => {
      io.observe(el);
      tryOnCleanup(() => io.unobserve(el));
    };
  }

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
      <Suspense fallback={<>loading pokemons...</>}>
        <div class="grid grid-cols-3 gap-2 w-full">
          <For each={pokemonsQuery.data?.pages}>
            {(page) => (
              <For each={page}>
                {(poke) => (
                  <div
                    class="flex flex-col items-center justify-center py-2.5 rounded-lg"
                    style={{
                      background: themeParams().sectionBackgroundColor,
                    }}
                  >
                    <img
                      class="aspect-square h-12"
                      src={poke.sprites.front_default ?? undefined}
                    />
                    <div class="-mt-0.5 capitalize">{poke.name}</div>
                    <div class="flex gap-1 flex-wrap mt-[3px]">
                      <For each={poke.types}>
                        {(info) => (
                          <span
                            class="inline-block rounded-full py-0.5 px-2 text-xs text-center"
                            classList={{
                              "bg-orange-500/10 text-orange-500":
                                info.type.name === "fire",
                              "bg-blue-500/10 text-blue-500":
                                info.type.name === "water",
                              "bg-green-300/10 text-green-300":
                                info.type.name === "grass",
                              "bg-yellow-300/10 text-yellow-300":
                                info.type.name === "electric",
                              "bg-gray-300/10 text-gray-300":
                                info.type.name === "normal",
                              "bg-purple-500/10 text-purple-500":
                                info.type.name === "poison",
                              "bg-pink-300/10 text-pink-300":
                                info.type.name === "fairy",
                              "bg-indigo-300/10 text-indigo-300":
                                info.type.name === "psychic",
                              "bg-gray-500/10 text-gray-500":
                                info.type.name === "rock",
                              "bg-black": info.type.name === "dark",
                              "bg-green-500/10 text-green-500":
                                info.type.name === "bug",
                              "bg-yellow-500/10 text-yellow-500":
                                info.type.name === "ground",
                              "bg-blue-300/10 text-blue-300":
                                info.type.name === "flying",
                              "bg-blue-200/10 text-blue-200":
                                info.type.name === "ice",
                              "bg-gray-700/10 text-gray-700":
                                info.type.name === "steel",
                              "bg-red-500/10 text-red-500":
                                info.type.name === "dragon",
                              "bg-purple-300/10 text-purple-300":
                                info.type.name === "ghost",
                              // "bg-gray-500": info.type.name === "fighting",
                            }}
                          >
                            {info.type.name}
                          </span>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            )}
          </For>
        </div>
        <Show when={pokemonsQuery.hasNextPage}>
          <span ref={setEl}>loading more...</span>
        </Show>
      </Suspense>
    </PageLayout>
  );
}
