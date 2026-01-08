'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCallback } from 'react';

interface BackButtonProps {
  label?: string;
  href?: string;
  className?: string;
  showLabel?: boolean;
}

export function BackButton({
  label = '返回',
  href,
  className = '',
  showLabel = true,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (href) {
      router.push(href);
    } else {
      // Try to go back in history
      if (window.history.length > 1) {
        router.back();
      } else {
        // Fallback to home if no history
        router.push('/');
      }
    }
  }, [router, href]);

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-[#FF6B6B] hover:bg-[#FFF5F5] transition-all duration-150 group ${className}`}
      title={`返回 (${label})`}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      {showLabel && (
        <span className="text-sm font-medium hidden sm:inline">{label}</span>
      )}
    </button>
  );
}
