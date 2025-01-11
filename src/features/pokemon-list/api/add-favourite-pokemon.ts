import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { z } from "zod";
import { InfiniteQueryData, Pokemon } from "@/types/api";
import { api } from "@/lib/api-client";

export const addfavouritePokemonSchema = z.object({
  id: z.number(),
});

export type AddFavouritePokemonInput = z.infer<
  typeof addfavouritePokemonSchema
> &
  Pokemon;

export const addPokemonToFavourite = (
  data: AddFavouritePokemonInput
): Promise<Pokemon> => {
  return api.post(`/api/v1/pokemons/favourites/${data.id}`);
};

type UseFavouritePokemonOptions = {
  mutationConfig?: MutationConfig<typeof addPokemonToFavourite>;
};

export const useAddFavouritePokemons = ({
  mutationConfig,
}: UseFavouritePokemonOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (_, data) => {
      queryClient.setQueryData<InfiniteQueryData>(
        ["pokemons", { isFavourite: false }],
        (oldData) => {
          if (!oldData) return undefined;
          const { pages, pageParams } = oldData;

          return {
            pages: pages.map((page) => ({
              ...page,
              pokemons: page.pokemons.map((pokemon) =>
                pokemon.id === data?.id
                  ? { ...pokemon, isFavourite: true }
                  : pokemon
              ),
            })),
            pageParams,
          };
        }
      );

      // Invalidating favourite pokemons query as need to refetch favourite pokemons
      queryClient.invalidateQueries({
        queryKey: ["pokemons", { isFavourite: true }],
      });

      onSuccess?.(_, data, null);
    },
    ...restConfig,
    mutationFn: addPokemonToFavourite,
  });
};
