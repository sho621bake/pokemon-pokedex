import React, { useState } from 'react';
import { trpc } from './main';
import { PokemonCard } from './components/PokemonCard';
import { SearchForm } from './components/SearchForm';
import { Pagination } from './components/Pagination';
import { Button } from './components/ui/button';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const pageSize = 20;

  // 検索条件に応じてクエリを切り替え
  const isSearching = nameQuery || typeQuery;

  // 名前で検索
  const nameSearchQuery = trpc.pokemon.searchByName.useQuery(
    { name: nameQuery },
    { enabled: !!nameQuery }
  );

  // タイプで検索
  const typeSearchQuery = trpc.pokemon.searchByType.useQuery(
    { type: typeQuery },
    { enabled: !!typeQuery }
  );

  // 通常の一覧取得
  const listQuery = trpc.pokemon.getList.useQuery(
    { limit: pageSize, offset: (page - 1) * pageSize },
    { enabled: !isSearching }
  );

  // 検索結果の処理
  let data: any = null;
  let isLoading = false;
  let error: any = null;

  if (nameQuery) {
    data = nameSearchQuery.data;
    isLoading = nameSearchQuery.isLoading;
    error = nameSearchQuery.error;
  } else if (typeQuery) {
    data = typeSearchQuery.data;
    isLoading = typeSearchQuery.isLoading;
    error = typeSearchQuery.error;
  } else {
    data = listQuery.data;
    isLoading = listQuery.isLoading;
    error = listQuery.error;
  }

  // 検索ハンドラー
  const handleSearch = (name: string, type: string) => {
    setNameQuery(name);
    setTypeQuery(type);
    setPage(1); // 検索時にはページを1に戻す
  };

  // ページネーションの処理
  const totalItems = data?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* ヒーローセクション */}
      <div className='relative rounded-2xl overflow-hidden mb-10 bg-gradient-to-r from-red-500 to-red-600'>
        <div className='absolute inset-0 bg-black/10 backdrop-filter backdrop-blur-sm'></div>
        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-10'>
          <div className='md:w-1/2 mb-6 md:mb-0'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white mb-4'>ポケモン図鑑</h1>
            <p className='text-red-100 mb-6 max-w-lg'>
              すべてのポケモンの詳細情報を探索しよう。名前やタイプで検索して、あなたのお気に入りのポケモンを見つけましょう。
            </p>
            <Button
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className='bg-white text-red-600 hover:bg-red-50'
            >
              検索を始める
            </Button>
          </div>
          <div className='md:w-1/2 flex justify-center'>
            <img
              src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
              alt='ピカチュウ'
              className='w-40 h-40 md:w-60 md:h-60 object-contain drop-shadow-2xl animate-bounce-slow'
            />
          </div>
        </div>
      </div>

      <SearchForm onSearch={handleSearch} />

      {isLoading ? (
        // スケルトンローディング
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className='rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md animate-pulse'
            >
              <div className='bg-gray-200 dark:bg-gray-700 h-40'></div>
              <div className='p-4'>
                <div className='h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3'></div>
                <div className='flex justify-center space-x-2'>
                  <div className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
                  <div className='h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg p-4 mb-6'>
          <div className='flex'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <span>データの取得に失敗しました。再度お試しください。</span>
          </div>
        </div>
      ) : data ? (
        <>
          <div className='mb-6 flex justify-between items-center'>
            <span className='font-medium text-lg'>
              {isSearching ? '検索結果: ' : '全ポケモン: '}
              <span className='font-bold text-red-600'>{data.count}</span> 件
            </span>

            {isSearching && (
              <Button
                variant='outline'
                onClick={() => handleSearch('', '')}
                className='text-sm border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950'
              >
                検索をクリア
              </Button>
            )}
          </div>

          {data.results.length === 0 ? (
            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg p-6 text-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-12 w-12 mx-auto mb-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
              <h3 className='text-lg font-medium mb-2'>検索結果がありません</h3>
              <p>検索条件を変更して再度お試しください。</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
              {data.results.map((pokemon: any) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}

          {!isSearching && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
