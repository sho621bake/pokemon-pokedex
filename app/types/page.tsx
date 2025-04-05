import React, { useState } from 'react';
import { trpc } from '../main';
import { PokemonCard } from '../components/PokemonCard';
import { TypeBadge } from '../components/TypeBadge';
import { typeNameMapping, typeColors } from '../lib/pokemonTypes';

export default function TypesPage() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // タイプで検索
  const typeSearchQuery = trpc.pokemon.searchByType.useQuery(
    { type: selectedType },
    { enabled: !!selectedType }
  );

  // タイプ選択ハンドラー
  const handleTypeSelect = (type: string) => {
    setIsLoading(true);
    setSelectedType(type);
  };

  // データ取得完了時にローディングを解除
  React.useEffect(() => {
    if (!typeSearchQuery.isLoading) {
      setIsLoading(false);
    }
  }, [typeSearchQuery.isLoading]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">ポケモンタイプ別検索</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          ポケモンのタイプを選択して、そのタイプに属するポケモンを表示します。各タイプには特有の強みと弱点があります。
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(typeNameMapping)
            .filter(([key]) => key !== 'all') // 'all'は除外
            .map(([type, japaneseName]) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`${
                  selectedType === type
                    ? `${typeColors[type].bg} ${typeColors[type].text} border-2 ${typeColors[type].border} shadow-md`
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                } rounded-lg p-4 transition-all flex flex-col items-center justify-center hover:scale-105`}
              >
                <span className="font-medium text-lg">{japaneseName}</span>
              </button>
            ))}
        </div>
      </div>

      {isLoading ? (
        // スケルトンローディング
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md animate-pulse"
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-40"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-center space-x-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : typeSearchQuery.error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {typeSearchQuery.error.message || `タイプ ${selectedType} のポケモンの取得に失敗しました`}
            </span>
          </div>
        </div>
      ) : selectedType && typeSearchQuery.data ? (
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <TypeBadge type={selectedType} large />
              <h2 className="text-2xl font-bold">
                タイプのポケモン: {typeSearchQuery.data.count}件
              </h2>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="font-medium mb-2">タイプ特性</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {getTypeDescription(selectedType)}
              </p>
            </div>
          </div>

          {typeSearchQuery.data.results.length === 0 ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-lg font-medium mb-2">ポケモンが見つかりません</h3>
              <p>別のタイプを選択してみてください。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {typeSearchQuery.data.results.map((pokemon: any) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg p-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">タイプを選択してください</h3>
          <p>上記のタイプボタンから、表示したいポケモンのタイプを選択してください。</p>
        </div>
      )}
    </div>
  );
}

// タイプの説明を取得する関数
function getTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    normal: 'バランスの取れた能力を持つポケモンが多く、特殊な耐性や弱点が少ないタイプです。かくとうタイプに弱く、ゴーストタイプの技は効きません。',
    fire: '炎を操るポケモンのタイプで、くさ・こおり・むし・はがねタイプに強いです。みず・じめん・いわタイプに弱点があります。',
    water: '水を操るポケモンのタイプで、ほのお・じめん・いわタイプに強いです。くさ・でんきタイプに弱点があります。',
    electric: '電気を操るポケモンのタイプで、みず・ひこうタイプに強いです。じめんタイプに弱点があります。',
    grass: '植物や自然の力を持つポケモンのタイプで、みず・じめん・いわタイプに強いです。ほのお・こおり・どく・ひこう・むしタイプに弱点があります。',
    ice: '氷を操るポケモンのタイプで、くさ・じめん・ひこう・ドラゴンタイプに強いです。ほのお・かくとう・いわ・はがねタイプに弱点があります。',
    fighting: '格闘技に長けたポケモンのタイプで、ノーマル・こおり・いわ・あく・はがねタイプに強いです。ひこう・エスパー・フェアリータイプに弱点があります。',
    poison: '毒を扱うポケモンのタイプで、くさ・フェアリータイプに強いです。じめん・エスパータイプに弱点があります。',
    ground: '大地の力を持つポケモンのタイプで、ほのお・でんき・どく・いわ・はがねタイプに強いです。みず・くさ・こおりタイプに弱点があります。',
    flying: '空を飛ぶポケモンのタイプで、くさ・かくとう・むしタイプに強いです。でんき・こおり・いわタイプに弱点があります。',
    psychic: '超能力を持つポケモンのタイプで、かくとう・どくタイプに強いです。むし・ゴースト・あくタイプに弱点があります。',
    bug: '昆虫のようなポケモンのタイプで、くさ・エスパー・あくタイプに強いです。ほのお・ひこう・いわタイプに弱点があります。',
    rock: '岩や鉱物のポケモンのタイプで、ほのお・こおり・ひこう・むしタイプに強いです。みず・くさ・かくとう・じめん・はがねタイプに弱点があります。',
    ghost: '幽霊や霊的なポケモンのタイプで、エスパー・ゴーストタイプに強いです。ゴースト・あくタイプに弱点があります。',
    dragon: '伝説的な力を持つドラゴンポケモンのタイプで、ドラゴンタイプに強いです。こおり・ドラゴン・フェアリータイプに弱点があります。',
    dark: '闇や悪の力を持つポケモンのタイプで、ゴースト・エスパータイプに強いです。かくとう・むし・フェアリータイプに弱点があります。',
    steel: '鋼鉄のような硬さを持つポケモンのタイプで、こおり・いわ・フェアリータイプに強いです。ほのお・かくとう・じめんタイプに弱点があります。',
    fairy: '妖精の力を持つポケモンのタイプで、かくとう・ドラゴン・あくタイプに強いです。どく・はがねタイプに弱点があります。',
  };
  
  return descriptions[type] || 'このタイプの詳細情報はまだ登録されていません。';
}
