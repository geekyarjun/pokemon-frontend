import Loader from "@/components/Loader";
import { PokemonCard } from "@/components/PokemonCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddFavouritePokemons } from "@/features/pokemon-list/api/add-favourite-pokemon";
import { usePokemons } from "@/features/pokemon-list/api/get-pokemon";
import { useRemoveFavouritePokemons } from "@/features/pokemon-list/api/remove-favourite-pokemon";
import { playAudio } from "@/lib/utils";
import { type Pokemon } from "@/types/api";
import { Heart } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import Error from "./Error";
import NoMoreFavourites from "./NoMoreFavourites";
import PokemonDialog from "./PokemonDialog";

function Pokemon() {
  // State
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  // Hooks
  const observer = useRef<IntersectionObserver>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePokemons({ isFavourite: showOnlyFavorites });

  const createFavouriteMutation = useAddFavouritePokemons({
    mutationConfig: {
      onSuccess: (_, { cries }) => {
        playAudio(cries);
      },
    },
  });

  const removeFavouriteMutation = useRemoveFavouritePokemons({
    isFavourite: showOnlyFavorites,
    mutationConfig: {},
  });

  // Event Handlers
  const lastPokemonRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const toggleFavorite = (e: React.MouseEvent, pokemon: Pokemon) => {
    e.stopPropagation();
    const buttonElement = e.currentTarget;
    const pokemonImgElement = buttonElement?.previousElementSibling;
    const { id: pokemonId, isFavourite } = pokemon;

    if (isFavourite) {
      removeFavouriteMutation.mutate({ id: pokemonId });
      pokemonImgElement?.classList?.toggle("animate-shake");
    } else {
      createFavouriteMutation.mutate(pokemon);
      pokemonImgElement?.classList?.toggle("animate-shake");
    }
  };

  if (status === "pending") return <Loader />;

  if (status === "error") return <Error />;

  const allPokemons = data?.pages?.flatMap((page) => page.pokemons) || [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
            Pokemon
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                showOnlyFavorites
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              {showOnlyFavorites ? (
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-current" />
                  Showing Favorites
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Show Favorites
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main area */}
        {showOnlyFavorites && allPokemons?.length === 0 ? (
          <NoMoreFavourites />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allPokemons?.map((pokemon, index) => (
              <PokemonCard
                key={pokemon.id}
                {...pokemon}
                onClick={() => setSelectedPokemon(pokemon)}
                handleToggleFavourite={(e) => toggleFavorite(e, pokemon)}
                ref={
                  !showOnlyFavorites && index === allPokemons?.length - 1
                    ? lastPokemonRef
                    : null
                }
              />
            ))}
          </div>
        )}

        {/* Loading Spinner - Load More */}
        {!showOnlyFavorites && isFetchingNextPage && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Pokemon Details Modal */}
      <Dialog
        open={selectedPokemon !== null}
        onOpenChange={(open) => !open && setSelectedPokemon(null)}
        aria-labelledby="dialog-title"
      >
        <DialogContent
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
          aria-describedby="dialog-description"
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold capitalize">
              {selectedPokemon?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedPokemon && <PokemonDialog {...selectedPokemon} />}
          <p className="sr-only" id="dialog-description">
            Selected pokemons stats
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Pokemon;
