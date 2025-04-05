// app/routes/not-found.tsx（アニメーション追加版）
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';

// ランダムなポケモンIDを生成する関数
const getRandomPokemonId = () => Math.floor(Math.random() * 150) + 1;

// 固定のポケモンIDを使用
const DEFAULT_POKEMON_ID = 25; // ピカチュウ

export default function NotFoundPage() {
  // クライアントサイドでのみランダム化するための状態
  const [pokemonId, setPokemonId] = useState(DEFAULT_POKEMON_ID);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドレンダリングの検出
  useEffect(() => {
    setIsClient(true);
    setPokemonId(getRandomPokemonId());
  }, []);

  // 別のランダムポケモンを表示する
  const handleChangePokemon = () => {
    setPokemonId(getRandomPokemonId());
  };

  // 実際に表示するポケモンID（サーバーではデフォルト、クライアントではランダム）
  const displayPokemonId = isClient ? pokemonId : DEFAULT_POKEMON_ID;

  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center text-center px-4'>
      <div className='space-y-6 max-w-md'>
        {/* 404 アイコンとポケモン */}
        <div className='relative mx-auto w-60 h-60'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-9xl font-bold text-red-600/10'>404</div>
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}.png`}
              alt='ポケモン'
              className={`w-40 h-40 object-contain ${isClient ? 'animate-bounce-slow' : ''}`}
            />
          </div>
        </div>

        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>ページが見つかりません</h1>

        <p className='text-gray-600 dark:text-gray-400'>
          お探しのページは存在しないか、別の場所に移動した可能性があります。
          トップページに戻って、他のポケモンを探してみましょう。
        </p>

        <div className='flex flex-col sm:flex-row gap-3 justify-center pt-4'>
          <Link to='/'>
            <Button className='bg-red-600 hover:bg-red-700 w-full sm:w-auto'>
              トップページに戻る
            </Button>
          </Link>
          <Button
            variant='outline'
            onClick={handleChangePokemon}
            className='border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 w-full sm:w-auto'
          >
            別のポケモンを表示
          </Button>
        </div>

        <div className='text-sm text-gray-500 dark:text-gray-500 pt-4'>
          <p>他にお探しのポケモンはいませんか？検索を使って探してみましょう。</p>
        </div>
      </div>
    </div>
  );
}
