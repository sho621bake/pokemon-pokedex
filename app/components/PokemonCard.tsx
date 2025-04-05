import { Link } from 'react-router-dom';
import type { PokemonListItem } from '../types/pokemon';
import { typeColors, typeNameMapping } from '../lib/pokemonTypes';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const dominantType = pokemon.types[0] || 'normal';
  const typeColor = typeColors[dominantType] || typeColors.normal;

  return (
    <Link to={`/pokemon/${pokemon.id}`} className='group'>
      <div
        className={`relative h-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 border dark:border-gray-700 hover:scale-105 ${typeColor.border}`}
      >
        {/* ポケモンナンバー */}
        <div className='absolute top-3 right-3 bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium'>
          No.{pokemon.id}
        </div>

        {/* ポケモン画像 */}
        <div
          className={`pt-8 pb-2 px-6 flex justify-center items-center ${typeColor.bg} bg-opacity-30`}
        >
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className='w-36 h-36 object-contain transform transition-transform duration-300 group-hover:scale-110 drop-shadow-md'
            loading='lazy'
          />
        </div>

        {/* ポケモン情報 */}
        <div className='p-4'>
          <h3 className='text-lg font-bold mb-2 text-center'>{pokemon.japaneseName}</h3>

          {/* タイプ */}
          <div className='flex justify-center gap-2 flex-wrap'>
            {pokemon.types.map((type) => {
              const typeStyle = typeColors[type] || typeColors.normal;
              return (
                <span
                  key={type}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                >
                  {typeNameMapping[type] || type}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
