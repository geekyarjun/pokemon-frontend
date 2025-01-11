import { api } from "@/lib/api-client";
import { Pokemon } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 150;

type PokemonQueryKey = [string, { isFavourite: boolean }];

interface Res {
  count: number;
  next: string;
  previous: string;
  result: Pokemon[];
}

const fetchPokemons = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam: number;
  queryKey: unknown;
}) => {
  const [, { isFavourite }] = queryKey as PokemonQueryKey;
  const urlPath = isFavourite
    ? "/api/v1/pokemons/favourites"
    : `/api/v1/pokemons?limit=${LIMIT}&offset=${pageParam}`;

  const response = await api.get<Res>(urlPath);

  return {
    pokemons: response?.result,
    nextOffset: pageParam + LIMIT,
    hasMore: pageParam + LIMIT < response?.count,
  };
};

export const usePokemons = ({ isFavourite }: { isFavourite: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["pokemons", { isFavourite }],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextOffset : undefined,
    initialPageParam: 0,
  });
};
