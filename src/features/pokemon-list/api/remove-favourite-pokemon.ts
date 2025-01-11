import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import { InfiniteQueryData, Pokemon } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const addfavouritePokemonSchema = z.object({
  id: z.number(),
});

export type AddFavouritePokemonInput = z.infer<
  typeof addfavouritePokemonSchema
>;

export const addPokemonToFavourite = (
  data: AddFavouritePokemonInput
): Promise<Pokemon[]> => {
  return api.delete(`/api/v1/pokemons/favourites/${data.id}`);
};

type UseFavouritePokemonOptions = {
  isFavourite: boolean;
  mutationConfig?: MutationConfig<typeof addPokemonToFavourite>;
};

export const useRemoveFavouritePokemons = ({
  isFavourite,
  mutationConfig,
}: UseFavouritePokemonOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (_, data) => {
      if (isFavourite) {
        queryClient.setQueryData<InfiniteQueryData>(
          ["pokemons", { isFavourite: true }],
          (oldData) => {
            if (!oldData) return undefined;
            const { pages, pageParams } = oldData;

            // Remove pokemon from favourite state
            return {
              pages: pages.map((page) => ({
                ...page,
                pokemons: page.pokemons.filter(
                  (pokemon) => pokemon.id != data?.id
                ),
              })),
              pageParams,
            };
          }
        );

        // Reset pokemons query as need to refetched pokemons
        queryClient.resetQueries({
          queryKey: ["pokemons", { isFavourite: false }],
        });
      } else {
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
                    ? { ...pokemon, isFavourite: false }
                    : pokemon
                ),
              })),
              pageParams,
            };
          }
        );
      }

      // Invalidaitng favourite pokemon query as need to refetch favourite pokemons
      queryClient.invalidateQueries({
        queryKey: ["pokemons", { isFavourite: true }],
      });
    },
    ...mutationConfig,
    mutationFn: addPokemonToFavourite,
  });
};
