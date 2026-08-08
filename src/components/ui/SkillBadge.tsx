import React from 'react';
import { SkillProficiency } from '../../types';

interface SkillBadgeProps {
  name: string;
  proficiency?: SkillProficiency | 'None';
  category?: string;
  onRemove?: () => void;
  selected?: boolean;
  onClick?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  proficiency,
  onRemove,
  selected = false,
  onClick,
}) => {
  const getProficiencyBg = (level?: string) => {
    switch (level) {
      case 'Advanced':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Beginner':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
        selected
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
          : getProficiencyBg(proficiency)
      } ${onClick ? 'cursor-pointer hover:border-indigo-300' : ''}`}
    >
      <span>{name}</span>
      {proficiency && !selected && (
        <span className="text-[10px] opacity-75 font-normal">({proficiency})</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-rose-600 focus:outline-none"
        >
          &times;
        </button>
      )}
    </span>
  );
};
