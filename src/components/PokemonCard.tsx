import { cn } from "@/lib/utils";
import { type Pokemon } from "@/types/api";
import { Heart } from "lucide-react";
import React from "react";

interface Props extends Pokemon {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  handleToggleFavourite: React.MouseEventHandler<HTMLButtonElement>;
}

export const PokemonCard = React.forwardRef<HTMLDivElement | null, Props>(
  (props: Props, ref) => {
    const {
      name,
      types,
      sprites,
      isFavourite,
      onClick,
      handleToggleFavourite,
    } = props;

    return (
      <div
        ref={ref}
        className="bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 cursor-pointer"
        onClick={onClick}
      >
        <div>
          <img
            src={sprites.front_default}
            alt={name}
            className={cn("w-32 h-32 mx-auto")}
          />
          <button
            onClick={handleToggleFavourite}
            className="absolute top-0 right-0 p-2"
          >
            {isFavourite ? (
              <Heart className="w-6 h-6 text-red-500 fill-current" />
            ) : (
              <Heart className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>

        <h2 className="text-lg font-medium text-center capitalize mt-2">
          {name}
        </h2>

        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          {types.map((type) => (
            <span
              key={type}
              className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    );
  }
);

PokemonCard.displayName = "PokemonCard";
