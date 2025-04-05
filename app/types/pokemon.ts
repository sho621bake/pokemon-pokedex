export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonListItem {
  id: number;
  name: string;
  japaneseName: string;
  image: string;
  types: string[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny?: string;
    back_shiny?: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: {
    name: string;
    language: {
      name: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
}

export interface OptimizedPokemonDetail {
  id: number;
  name: string;
  japaneseName: string;
  height: number;
  weight: number;
  types: string[];
  abilities: {
    name: string;
    isHidden: boolean;
  }[];
  stats: {
    name: string;
    baseStat: number;
  }[];
  sprites: {
    front: string;
    back: string;
    frontShiny: string;
    backShiny: string;
    officialArtwork: string;
  };
  species: {
    genera: string;
    flavorText: string;
    evolutionChainId: number | null;
  };
}

// 進化チェーンのAPI応答型
export interface EvolutionChainResponse {
  id: number;
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolution_details: {
      min_level: number | null;
      trigger: {
        name: string;
      };
      item: {
        name: string;
      } | null;
    }[];
    evolves_to: EvolutionNode[];
  };
}

// 進化チェーンのノード型（再帰的な構造）
export interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolution_details: {
    min_level: number | null;
    trigger: {
      name: string;
    };
    item: {
      name: string;
    } | null;
  }[];
  evolves_to: EvolutionNode[];
}

// 最適化された進化チェーン型
export interface OptimizedEvolutionChain {
  id: number;
  chain: OptimizedEvolutionNode[];
}

// 最適化された進化チェーンノード型
export interface OptimizedEvolutionNode {
  id: number;
  name: string;
  japaneseName: string;
  image: string;
  evolutionDetails: {
    trigger: string;
    minLevel: number | null;
    item: string | null;
  } | null;
}
