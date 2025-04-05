import type {
  PokemonDetail,
  PokemonListResponse,
  PokemonSpecies,
  PokemonListItem,
  EvolutionChainResponse,
  OptimizedEvolutionChain,
  OptimizedEvolutionNode,
  EvolutionNode
} from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// メモリキャッシュの実装
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 30; // 30分キャッシュ

// カスタムエラークラスを作成
export class NotFoundError extends Error {
  status: number;
  
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

// キャッシュ付きフェッチ関数
async function cachedFetch<T>(url: string): Promise<T> {
  const cacheKey = url;
  const now = Date.now();
  
  // キャッシュチェック
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data as T;
  }
  
  // キャッシュがない場合はフェッチ
  const response = await fetchWithTimeout(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      const path = url.split('/').pop() || '';
      throw new NotFoundError(`リソースが見つかりません: ${path}`);
    }
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  const data = await response.json();
  
  // キャッシュに保存
  cache[cacheKey] = { data, timestamp: now };
  
  return data as T;
}

// 共通のフェッチ関数 - タイムアウトとエラーハンドリングを追加
async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      // キャッシュ設定
      cache: 'default'
    });
    
    return response;
  } catch (error: any) {
    // AbortControllerによるタイムアウトエラー
    if (error.name === 'AbortError') {
      throw new Error('リクエストがタイムアウトしました');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

// ポケモン一覧を取得する関数
export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  return cachedFetch<PokemonListResponse>(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
}

// ポケモン詳細を取得する関数
export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  // 存在しないIDの場合は早期に失敗
  if (typeof idOrName === 'number' && (idOrName <= 0 || idOrName > 1010)) {
    throw new NotFoundError(`ポケモンが見つかりません: ${idOrName}`);
  }
  
  return cachedFetch<PokemonDetail>(`${API_BASE_URL}/pokemon/${idOrName}`);
}

// ポケモン種族情報を取得する関数
export async function getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
  // 存在しないIDの場合は早期に失敗
  if (typeof idOrName === 'number' && (idOrName <= 0 || idOrName > 1010)) {
    throw new NotFoundError(`ポケモン種族情報が見つかりません: ${idOrName}`);
  }
  
  return cachedFetch<PokemonSpecies>(`${API_BASE_URL}/pokemon-species/${idOrName}`);
}

// 日本語名を含むポケモン情報を取得する関数
export async function getPokemonWithJapaneseName(id: number): Promise<{
  details: PokemonDetail;
  species: PokemonSpecies;
}> {
  // 並列フェッチで高速化
  const [details, species] = await Promise.all([getPokemonDetail(id), getPokemonSpecies(id)]);
  return { details, species };
}

// ポケモン一覧を拡張情報付きで取得する関数
export async function getEnhancedPokemonList(
  limit = 20,
  offset = 0
): Promise<{
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}> {
  const list = await getPokemonList(limit, offset);
  
  // 並列処理で高速化
  const enhancedResults = await Promise.all(
    list.results.map(async (pokemon) => {
      // URLからIDを抽出
      const id = Number(pokemon.url.split('/').filter(Boolean).pop());

      try {
        const { details, species } = await getPokemonWithJapaneseName(id);

        // 日本語の名前を取得
        const japaneseName =
          species.names.find((name) => name.language.name === 'ja')?.name || details.name;

        return {
          id,
          name: details.name,
          japaneseName,
          image: details.sprites.other['official-artwork'].front_default,
          types: details.types.map((t) => t.type.name),
        };
      } catch (error) {
        console.error(`Error fetching details for ${pokemon.name}:`, error);
        return {
          id,
          name: pokemon.name,
          japaneseName: pokemon.name,
          image: '',
          types: [],
        };
      }
    })
  );

  return {
    count: list.count,
    next: list.next,
    previous: list.previous,
    results: enhancedResults,
  };
}

// タイプでフィルタリングするためのポケモン一覧を取得する関数
export async function getPokemonsByType(type: string): Promise<PokemonListItem[]> {
  const data = await cachedFetch<any>(`${API_BASE_URL}/type/${type}`);
  
  // 最初の20件だけ処理して高速化
  const pokemonEntries = data.pokemon.slice(0, 20);
  
  const enhancedResults = await Promise.all(
    pokemonEntries.map(async (entry: { pokemon: { name: string; url: string } }) => {
      const id = Number(entry.pokemon.url.split('/').filter(Boolean).pop());

      try {
        const { details, species } = await getPokemonWithJapaneseName(id);

        const japaneseName =
          species.names.find((name) => name.language.name === 'ja')?.name || details.name;

        return {
          id,
          name: details.name,
          japaneseName,
          image: details.sprites.other['official-artwork'].front_default,
          types: details.types.map((t) => t.type.name),
        };
      } catch (error) {
        console.error(`Error fetching details for ${entry.pokemon.name}:`, error);
        return {
          id,
          name: entry.pokemon.name,
          japaneseName: entry.pokemon.name,
          image: '',
          types: [],
        };
      }
    })
  );

  return enhancedResults;
}

// 進化チェーンを取得する関数
export async function getEvolutionChain(chainId: number): Promise<EvolutionChainResponse> {
  return cachedFetch<EvolutionChainResponse>(`${API_BASE_URL}/evolution-chain/${chainId}`);
}

// 進化チェーンを最適化された形式に変換する関数
export async function getOptimizedEvolutionChain(chainId: number): Promise<OptimizedEvolutionChain> {
  try {
    const evolutionChain = await getEvolutionChain(chainId);
    
    // 進化チェーンを平坦化して処理しやすくする
    const flattenedChain: OptimizedEvolutionNode[] = [];
    
    // 最初のポケモン（進化前）を追加
    const firstSpecies = evolutionChain.chain.species;
    const firstId = Number(firstSpecies.url.split('/').filter(Boolean).pop());

    // 最初のポケモンの詳細情報を取得
    const { details: firstDetails, species: firstSpeciesData } = await getPokemonWithJapaneseName(firstId);

    flattenedChain.push({
      id: firstId,
      name: firstSpecies.name,
      japaneseName: firstSpeciesData.names.find(name => name.language.name === 'ja')?.name || firstSpecies.name,
      image: firstDetails.sprites.other['official-artwork'].front_default,
      evolutionDetails: null // 最初のポケモンには進化の詳細はない
    });
    
    // 進化チェーンを再帰的に処理する関数
    async function processEvolutionNode(node: EvolutionNode, chain: OptimizedEvolutionNode[]): Promise<void> {
      for (const evolution of node.evolves_to) {
        const speciesId = Number(evolution.species.url.split('/').filter(Boolean).pop());
        
        // 進化先ポケモンの詳細情報を取得
        const { details, species } = await getPokemonWithJapaneseName(speciesId);
        
        // 進化の詳細情報を取得
        const evolutionDetail = evolution.evolution_details[0] || null;
        
        chain.push({
          id: speciesId,
          name: evolution.species.name,
          japaneseName: species.names.find(name => name.language.name === 'ja')?.name || evolution.species.name,
          image: details.sprites.other['official-artwork'].front_default,
          evolutionDetails: evolutionDetail ? {
            trigger: evolutionDetail.trigger.name,
            minLevel: evolutionDetail.min_level,
            item: evolutionDetail.item?.name || null
          } : null
        });
        
        // さらに進化がある場合は再帰的に処理
        if (evolution.evolves_to.length > 0) {
          await processEvolutionNode(evolution, chain);
        }
      }
    }
    
    // 最初の進化ノードから処理を開始
    await processEvolutionNode(evolutionChain.chain, flattenedChain);
    
    return {
      id: evolutionChain.id,
      chain: flattenedChain
    };
  } catch (error) {
    console.error(`Error fetching evolution chain ${chainId}:`, error);
    
    // NotFoundErrorの場合は404エラーを返す
    if (error instanceof NotFoundError) {
      throw error;
    }
    
    throw new Error(`進化チェーンの取得に失敗しました: ${chainId}`);
  }
}
