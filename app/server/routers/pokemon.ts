import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import {
  getEnhancedPokemonList,
  getPokemonDetail,
  getPokemonSpecies,
  getPokemonWithJapaneseName,
  getPokemonsByType,
  getOptimizedEvolutionChain,
  NotFoundError,
} from '../../api/pokeApi';
import type { OptimizedPokemonDetail } from '../../types/pokemon';

export const pokemonRouter = router({
  // ポケモン一覧を取得
  getList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const { limit, offset } = input;
        const data = await getEnhancedPokemonList(limit, offset);
        return data;
      } catch (error) {
        console.error('Error fetching pokemon list:', error);
        throw new Error('ポケモン一覧の取得に失敗しました');
      }
    }),

  // ポケモン詳細を取得
  getDetail: publicProcedure
    .input(
      z.object({
        id: z.union([z.string(), z.number()]),
      })
    )
    .query(async ({ input }): Promise<OptimizedPokemonDetail> => {
      try {
        // IDが数値の場合は範囲チェック
        const pokemonId = typeof input.id === 'number' ? input.id : parseInt(input.id, 10);
        
        if (isNaN(pokemonId) || pokemonId <= 0 || pokemonId > 1010) {
          throw new NotFoundError(`ポケモンが見つかりません: ${input.id}`);
        }
        
        // 並列フェッチで高速化
        const { details, species } = await getPokemonWithJapaneseName(pokemonId);
        
        // 日本語名を取得
        const japaneseName = species.names.find(name => name.language.name === 'ja')?.name || details.name;
        
        // 日本語の説明文を取得
        const japaneseFlavorText = species.flavor_text_entries
          .filter(entry => entry.language.name === 'ja')
          .map(entry => entry.flavor_text.replace(/\f/g, '\n')) // 改行コードの修正
          [0] || ''; // 最新の説明文のみを使用
        
        // 進化チェーンのURLからIDを抽出
        const evolutionChainId = species.evolution_chain?.url
          ? Number(species.evolution_chain.url.split('/').filter(Boolean).pop())
          : null;
          
        return {
          id: details.id,
          name: details.name,
          japaneseName,
          height: details.height / 10, // メートル単位に変換
          weight: details.weight / 10, // キログラム単位に変換
          types: details.types.map(t => t.type.name),
          abilities: details.abilities.map(a => ({
            name: a.ability.name,
            isHidden: a.is_hidden,
          })),
          stats: details.stats.map(s => ({
            name: s.stat.name,
            baseStat: s.base_stat,
          })),
          sprites: {
            front: details.sprites.front_default,
            back: details.sprites.back_default,
            frontShiny: details.sprites.front_shiny || '',
            backShiny: details.sprites.back_shiny || '',
            officialArtwork: details.sprites.other['official-artwork'].front_default,
          },
          species: {
            genera: species.genera.find(g => g.language.name === 'ja')?.genus || '',
            flavorText: japaneseFlavorText,
            evolutionChainId,
          },
        };
      } catch (error) {
        console.error(`Error fetching pokemon detail for ${input.id}:`, error);
        
        // NotFoundErrorの場合は404エラーを返す
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        throw new Error(`ポケモン詳細の取得に失敗しました: ${input.id}`);
      }
    }),

  // 進化チェーンを取得
  getEvolutionChain: publicProcedure
    .input(
      z.object({
        chainId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { chainId } = input;
        
        if (!chainId || chainId <= 0) {
          throw new Error('有効な進化チェーンIDを指定してください');
        }
        
        const evolutionChain = await getOptimizedEvolutionChain(chainId);
        return evolutionChain;
      } catch (error) {
        console.error(`Error fetching evolution chain for ${input.chainId}:`, error);
        
        // NotFoundErrorの場合は404エラーを返す
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        throw new Error(`進化チェーンの取得に失敗しました: ${input.chainId}`);
      }
    }),

  // 名前で検索
  searchByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      try {
        // 名前が空の場合はエラー
        if (!input.name) {
          throw new Error('名前を指定してください');
        }
        
        // 全ポケモンリストを取得して名前でフィルタリング
        // 実際のアプリでは検索APIを使うべきですが、PokeAPIにはそのようなエンドポイントがないため
        // 最初の100件から検索
        const allPokemon = await getEnhancedPokemonList(100, 0);
        
        // 名前の部分一致で検索（英語名と日本語名の両方）
        const filteredResults = allPokemon.results.filter(pokemon => 
          pokemon.name.toLowerCase().includes(input.name.toLowerCase()) || 
          pokemon.japaneseName.includes(input.name)
        );
        
        return {
          count: filteredResults.length,
          results: filteredResults,
        };
      } catch (error) {
        console.error(`Error searching pokemon by name ${input.name}:`, error);
        
        // NotFoundErrorの場合は404エラーを返す
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        throw new Error(`名前 ${input.name} のポケモンの検索に失敗しました`);
      }
    }),

  // タイプで検索
  searchByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ input }) => {
      try {
        // タイプが空の場合はエラー
        if (!input.type) {
          throw new Error('タイプを指定してください');
        }
        
        const results = await getPokemonsByType(input.type);
        
        return {
          count: results.length,
          results,
        };
      } catch (error) {
        console.error(`Error searching pokemon by type ${input.type}:`, error);
        
        // NotFoundErrorの場合は404エラーを返す
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        throw new Error(`タイプ ${input.type} のポケモンの取得に失敗しました`);
      }
    }),
});
