'use client';

import * as React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, onCheckedChange, className = '', ...props }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={`w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 ${className}`}
      {...props}
    />
  );
}
