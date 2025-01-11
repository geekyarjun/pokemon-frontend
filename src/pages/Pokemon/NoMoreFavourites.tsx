import { Heart } from "lucide-react";

const NoMoreFavourites = () => {
  return (
    <div className="text-center py-12">
      <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        No Favorites Yet
      </h2>
      <p className="text-gray-500">
        Click the heart icon on any Pokémon to add it to your favorites
      </p>
    </div>
  );
};

export default NoMoreFavourites;
