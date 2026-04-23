'use client';

import { forwardRef } from 'react';

// Shared base classes — zero border radius, consistent sizing
export const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-none bg-[#D94550] text-white font-semibold text-sm px-5 py-3 hover:bg-[#c23a46] disabled:opacity-40 transition';

export const btnDark =
  'inline-flex items-center justify-center gap-2 rounded-none bg-gray-900 text-white font-semibold text-sm px-5 py-3 hover:bg-gray-700 disabled:opacity-40 transition';

export const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-none border border-white text-white font-semibold text-sm px-5 py-3 hover:bg-white hover:text-gray-900 disabled:opacity-40 transition';

export const btnOutlineDark =
  'inline-flex items-center justify-center gap-2 rounded-none border border-gray-600 text-white font-semibold text-sm px-5 py-3 hover:border-white disabled:opacity-40 transition';

// Shared input class — no w-full so callers can control width
export const inputClass =
  'rounded-none border border-gray-700 bg-gray-900 text-white placeholder:text-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:border-[#D94550] transition';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline' | 'outlineDark';
}

const variantMap = {
  primary: btnPrimary,
  dark: btnDark,
  outline: btnOutline,
  outlineDark: btnOutlineDark,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    return (
      <button ref={ref} className={`${variantMap[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
