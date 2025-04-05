import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SearchFormProps {
  onSearch: (name: string, type: string) => void;
}

const pokemonTypes = [
  { value: 'normal', label: 'ノーマル' },
  { value: 'fire', label: 'ほのお' },
  { value: 'water', label: 'みず' },
  { value: 'electric', label: 'でんき' },
  { value: 'grass', label: 'くさ' },
  { value: 'ice', label: 'こおり' },
  { value: 'fighting', label: 'かくとう' },
  { value: 'poison', label: 'どく' },
  { value: 'ground', label: 'じめん' },
  { value: 'flying', label: 'ひこう' },
  { value: 'psychic', label: 'エスパー' },
  { value: 'bug', label: 'むし' },
  { value: 'rock', label: 'いわ' },
  { value: 'ghost', label: 'ゴースト' },
  { value: 'dragon', label: 'ドラゴン' },
  { value: 'dark', label: 'あく' },
  { value: 'steel', label: 'はがね' },
  { value: 'fairy', label: 'フェアリー' },
];

export function SearchForm({ onSearch }: SearchFormProps) {
  const [nameQuery, setNameQuery] = useState('');
  const [typeQuery, setTypeQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(nameQuery, typeQuery);
  };

  const handleClear = () => {
    setNameQuery('');
    setTypeQuery('');
    onSearch('', '');
  };

  return (
    <div className={`mb-8 transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700'
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      >
        <div className='bg-gradient-to-r from-red-500 to-red-600 p-4'>
          <h2 className='text-white font-bold text-xl'>ポケモン検索</h2>
          <p className='text-red-100 text-sm mt-1'>名前またはタイプで検索できます</p>
        </div>

        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label htmlFor='name' className='text-sm font-medium block dark:text-gray-300'>
                ポケモン名
              </label>
              <div className='relative'>
                <Input
                  id='name'
                  placeholder='名前を入力...'
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className='pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
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
              </div>
            </div>

            <div className='space-y-2'>
              <label htmlFor='type' className='text-sm font-medium block dark:text-gray-300'>
                タイプ
              </label>
              <Select value={typeQuery} onValueChange={setTypeQuery}>
                <SelectTrigger className='bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'>
                  <SelectValue placeholder='タイプを選択' />
                </SelectTrigger>
                <SelectContent>
                  {pokemonTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-end space-x-2'>
              <Button
                type='submit'
                className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium'
              >
                検索
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={handleClear}
                className='border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950'
              >
                クリア
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
