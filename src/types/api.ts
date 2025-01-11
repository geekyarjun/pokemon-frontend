export type Ability = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
};

export type State = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  isFavourite: boolean;
  sprites: {
    front_default: string;
    back_default: string;
  };
  cries: string;
  abilities: Ability[];
  stats: State[];
  types: string[];
}

export type PaginatedPokemonData = {
  pokemons: Pokemon[];
  hasMore: boolean;
  nextOffset: number;
};

export type InfiniteQueryData = {
  pages: PaginatedPokemonData[]; // Array of paginated data
  pageParams: number[]; // Array of page parameters
};
