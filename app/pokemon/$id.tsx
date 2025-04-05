import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { trpc } from '../main';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { typeColors, typeNameMapping } from '../lib/pokemonTypes';
import { abilityNameMapping } from '../lib/pokemonAbilities';

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pokemonId = Number(id);
  const [activeTab, setActiveTab] = useState('info');
  const [imageView, setImageView] = useState<'official' | 'front' | 'back' | 'shiny'>('official');

  const { data, isLoading, error } = trpc.pokemon.getDetail.useQuery(
    { id: pokemonId },
    { enabled: !!id }
  );

  // 進化チェーンを取得
  const evolutionChainQuery = trpc.pokemon.getEvolutionChain.useQuery(
    { chainId: data?.species.evolutionChainId || 0 },
    { enabled: !!data?.species.evolutionChainId }
  );

  // 前後のポケモンのIDを計算
  const prevId = pokemonId > 1 ? pokemonId - 1 : null;
  const nextId = pokemonId < 1010 ? pokemonId + 1 : null; // ポケモンの最大数を1010と仮定

  // 前後のポケモン情報取得
  const prevPokemon = trpc.pokemon.getDetail.useQuery(
    { id: prevId! },
    {
      enabled: prevId !== null && !error,
      retry: 1,
    }
  );

  const nextPokemon = trpc.pokemon.getDetail.useQuery(
    { id: nextId! },
    {
      enabled: nextId !== null && !error,
      retry: 1,
    }
  );

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='mb-4'>
          <Link to='/' className='text-blue-600 hover:underline flex items-center'>
            <svg
              className='w-4 h-4 mr-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              ></path>
            </svg>
            一覧に戻る
          </Link>
        </div>

        <div className='animate-pulse space-y-8'>
          <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4'></div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-gray-200 dark:bg-gray-700 rounded-xl h-64'></div>
            <div className='space-y-4'>
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
              <div className='h-24 bg-gray-200 dark:bg-gray-700 rounded'></div>
              <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // エラー表示画面は不要（useEffectで404ページにリダイレクトするため）
  if (error || !data) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-red-600'></div>
        </div>
      </div>
    );
  }

  // 日本語の名前と説明を取得
  const jaName = data.japaneseName;
  const japaneseDescription = data.species.flavorText;

  // 主要なタイプの色を取得
  const mainType = data.types[0] || 'normal';
  const typeStyle = typeColors[mainType] || typeColors.normal;

  // 進化前/進化後のポケモン名を取得（実装の簡略化のため省略）

  // ポケモン画像の選択
  const getSelectedImage = () => {
    switch (imageView) {
      case 'front':
        return data.sprites.front;
      case 'back':
        return data.sprites.back;
      case 'shiny':
        return ''; // Shiny sprites not available in the optimized structure
      default:
        return data.sprites.officialArtwork;
    }
  };

  // 進化の条件を日本語で表示する関数
  const getEvolutionCondition = (
    details: {
      trigger: string;
      minLevel: number | null;
      item: string | null;
    } | null
  ) => {
    if (!details) return '';

    const triggerMap: Record<string, string> = {
      'level-up': 'レベルアップ',
      trade: '通信交換',
      'use-item': 'アイテム使用',
      shed: '脱皮',
      spin: '回転',
      'tower-of-darkness': '暗の塔',
      'tower-of-water': '水の塔',
      'three-critical-hits': '急所3回',
      'take-damage': 'ダメージを受ける',
      other: 'その他',
    };

    let condition = triggerMap[details.trigger] || details.trigger;

    if (details.minLevel) {
      condition += `（レベル ${details.minLevel}）`;
    }

    if (details.item) {
      // アイテム名の日本語化（実際のアプリでは別途マッピングが必要）
      condition += `（${details.item}）`;
    }

    return condition;
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-4'>
        <Link
          to='/'
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className='text-blue-600 hover:underline flex items-center'
        >
          <svg
            className='w-4 h-4 mr-1'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            ></path>
          </svg>
          一覧に戻る
        </Link>
      </div>

      <div
        className={`relative rounded-xl overflow-hidden mb-8 p-6 ${typeStyle.bg} bg-opacity-30 border ${typeStyle.border}`}
      >
        <div className='absolute top-6 right-6 bg-black/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium'>
          No.{data.id}
        </div>

        <h1 className='text-3xl md:text-4xl font-bold mb-2 flex items-center'>
          {jaName}
          <span className='ml-3 text-gray-500 text-lg'>{data.name}</span>
        </h1>

        <div className='flex flex-wrap gap-2 mb-4'>
          {data.types.map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                typeColors[type]?.text || 'text-white'
              } ${typeColors[type]?.bg || 'bg-gray-500'}`}
            >
              {typeNameMapping[type] || type}
            </span>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
        <div
          className={`rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border ${typeStyle.border} p-4`}
        >
          <div className='flex justify-center items-center h-64 mb-4'>
            <img
              src={getSelectedImage()}
              alt={data.name}
              className='max-h-full max-w-full object-contain transition-all duration-300 hover:scale-110 drop-shadow-md'
            />
          </div>

          <div className='flex justify-center gap-2'>
            <Button
              variant={imageView === 'official' ? 'default' : 'outline'}
              onClick={() => setImageView('official')}
              className={imageView === 'official' ? 'bg-red-600 hover:bg-red-700' : ''}
              size='sm'
            >
              公式
            </Button>
            <Button
              variant={imageView === 'front' ? 'default' : 'outline'}
              onClick={() => setImageView('front')}
              className={imageView === 'front' ? 'bg-red-600 hover:bg-red-700' : ''}
              size='sm'
            >
              正面
            </Button>
            <Button
              variant={imageView === 'back' ? 'default' : 'outline'}
              onClick={() => setImageView('back')}
              className={imageView === 'back' ? 'bg-red-600 hover:bg-red-700' : ''}
              size='sm'
            >
              背面
            </Button>
            <Button
              variant={imageView === 'shiny' ? 'default' : 'outline'}
              onClick={() => setImageView('shiny')}
              className={imageView === 'shiny' ? 'bg-red-600 hover:bg-red-700' : ''}
              size='sm'
            >
              色違い
            </Button>
          </div>
        </div>

        <div>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg mb-6 border border-gray-200 dark:border-gray-700'>
            <h3 className='text-lg font-semibold mb-3'>説明</h3>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              {japaneseDescription}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700'>
              <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>高さ</h3>
              <p className='text-xl font-bold'>{data.height} m</p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700'>
              <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>重さ</h3>
              <p className='text-xl font-bold'>{data.weight} kg</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue='stats' className='mb-10'>
        <TabsList className='w-full justify-start mb-6'>
          <TabsTrigger value='stats' className='text-sm md:text-base'>
            ステータス
          </TabsTrigger>
          <TabsTrigger value='abilities' className='text-sm md:text-base'>
            特性
          </TabsTrigger>
          <TabsTrigger value='evolution' className='text-sm md:text-base'>
            進化
          </TabsTrigger>
        </TabsList>

        <TabsContent value='stats' className='space-y-6'>
          <Card className='overflow-hidden border border-gray-200 dark:border-gray-700'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>基本ステータス</h3>
              <div className='space-y-4'>
                {data.stats.map((stat) => {
                  const statValue = stat.baseStat;
                  const statMax = 255;
                  const percentage = Math.min(100, (statValue / statMax) * 100);

                  const getStatColor = (stat: string) => {
                    switch (stat) {
                      case 'hp':
                        return 'bg-green-500';
                      case 'attack':
                        return 'bg-red-500';
                      case 'defense':
                        return 'bg-blue-500';
                      case 'special-attack':
                        return 'bg-yellow-500';
                      case 'special-defense':
                        return 'bg-purple-500';
                      case 'speed':
                        return 'bg-pink-500';
                      default:
                        return 'bg-gray-500';
                    }
                  };
                  const barColor = getStatColor(stat.name);

                  // ステータス名の日本語マッピング
                  const statNames: Record<string, string> = {
                    hp: 'HP',
                    attack: '攻撃',
                    defense: '防御',
                    'special-attack': '特攻',
                    'special-defense': '特防',
                    speed: '素早さ',
                  };

                  return (
                    <div key={stat.name} className='relative'>
                      <div className='flex justify-between mb-1'>
                        <span className='text-sm font-medium'>
                          {statNames[stat.name] || stat.name}
                        </span>
                        <span className='text-sm font-medium'>{statValue}</span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
                        <div
                          className={`${barColor} h-2.5 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value='abilities' className='space-y-4'>
          <Card className='overflow-hidden border border-gray-200 dark:border-gray-700'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>特性</h3>
              <ul className='space-y-4'>
                {data.abilities.map((ability) => (
                  <li key={ability.name} className='flex items-start'>
                    <div
                      className={`w-3 h-3 mt-1.5 rounded-full mr-2 ${
                        ability.isHidden ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                    ></div>
                    <div>
                      <div className='font-medium'>
                        {abilityNameMapping[ability.name] || ability.name}{' '}
                        {ability.isHidden && (
                          <span className='text-xs text-purple-500 font-normal'>(隠れ特性)</span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value='evolution' className='space-y-4'>
          <Card className='overflow-hidden border border-gray-200 dark:border-gray-700'>
            <div className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>進化チェーン</h3>

              {evolutionChainQuery.isLoading && (
                <div className='flex justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-red-600'></div>
                </div>
              )}

              {evolutionChainQuery.error && (
                <div className='text-center py-4'>
                  <p className='text-red-500'>進化チェーンの取得に失敗しました</p>
                </div>
              )}

              {!evolutionChainQuery.isLoading &&
                !evolutionChainQuery.error &&
                evolutionChainQuery.data && (
                  <div className='flex flex-col items-center'>
                    {evolutionChainQuery.data.chain.length === 1 ? (
                      <div className='text-center py-4'>
                        <p>このポケモンは進化しません</p>
                      </div>
                    ) : (
                      <div className='w-full'>
                        <div className='flex flex-wrap justify-center gap-4'>
                          {evolutionChainQuery.data.chain.map((pokemon, index) => (
                            <React.Fragment key={pokemon.id}>
                              {/* 進化の矢印 */}
                              {index > 0 && (
                                <div className='flex flex-col items-center justify-center px-2'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-8 w-8 text-gray-400'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M13 7l5 5m0 0l-5 5m5-5H6'
                                    />
                                  </svg>
                                  {pokemon.evolutionDetails && (
                                    <span className='text-xs text-gray-500 text-center max-w-[120px] mt-1'>
                                      {getEvolutionCondition(pokemon.evolutionDetails)}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* ポケモンカード */}
                              <Link
                                to={`/pokemon/${pokemon.id}`}
                                className={`flex flex-col items-center p-4 rounded-lg border ${
                                  pokemon.id === data.id
                                    ? `${typeStyle.border} ${typeStyle.bg} bg-opacity-30`
                                    : 'border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 dark:hover:border-red-900 dark:hover:bg-red-950/20'
                                } transition-all duration-200`}
                              >
                                <div className='w-20 h-20 flex items-center justify-center'>
                                  <img
                                    src={pokemon.image}
                                    alt={pokemon.name}
                                    className='max-w-full max-h-full object-contain'
                                  />
                                </div>
                                <div className='mt-2 text-center'>
                                  <div className='text-sm font-semibold'>
                                    {pokemon.japaneseName}
                                  </div>
                                  <div className='text-xs text-gray-500'>No.{pokemon.id}</div>
                                </div>
                              </Link>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {!evolutionChainQuery.isLoading &&
                !evolutionChainQuery.data &&
                !evolutionChainQuery.error && (
                  <div className='text-center py-4'>
                    <p className='text-gray-600 dark:text-gray-400'>進化チェーン情報がありません</p>
                  </div>
                )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className='flex justify-between py-4 border-t border-gray-200 dark:border-gray-700 mt-6'>
        {prevId && prevPokemon.data ? (
          <Link to={`/pokemon/${prevId}`} className='group'>
            <Button
              variant='outline'
              className='flex items-center border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 dark:hover:border-red-900 dark:hover:bg-red-950/20'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7m-7 7h18'
                ></path>
              </svg>
              <div className='text-left'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>前のポケモン</div>
                <div className='font-medium'>
                  No.{prevId} {prevPokemon.data.japaneseName}
                </div>
              </div>
            </Button>
          </Link>
        ) : (
          <div></div>
        )}

        {nextId && nextPokemon.data ? (
          <Link to={`/pokemon/${nextId}`} className='group'>
            <Button
              variant='outline'
              className='flex items-center border-gray-200 dark:border-gray-700 hover:border-red-200 hover:bg-red-50 dark:hover:border-red-900 dark:hover:bg-red-950/20'
            >
              <div className='text-right'>
                <div className='text-xs text-gray-500 dark:text-gray-400'>次のポケモン</div>
                <div className='font-medium'>
                  No.{nextId} {nextPokemon.data.japaneseName}
                </div>
              </div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 ml-2 transition-transform group-hover:translate-x-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
