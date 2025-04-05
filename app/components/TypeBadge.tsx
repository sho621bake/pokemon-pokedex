import React from 'react';
import { typeColors, typeNameMapping } from '../lib/pokemonTypes';

interface TypeBadgeProps {
  type: string;
  large?: boolean;
  onClick?: () => void;
}

export function TypeBadge({ type, large = false, onClick }: TypeBadgeProps) {
  const style = typeColors[type] || typeColors.normal;
  const name = typeNameMapping[type] || type;
  
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        ${style.bg} ${style.text} ${style.border}
        ${large ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs'}
        font-medium rounded-full border
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        transition-all
      `}
    >
      {name}
    </span>
  );
}
