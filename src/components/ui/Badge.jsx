import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const variants = {
    default: 'bg-paper-200 text-ink-800 border-paper-300',
    primary: 'bg-ink-100 text-ink-900 border-ink-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    forest: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    used: 'bg-stone-100 text-stone-700 border-stone-300',
    new: 'bg-amber-50 text-amber-900 border-amber-300'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-md border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
