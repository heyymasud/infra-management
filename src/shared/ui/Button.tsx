import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'standard' | 'menuItem' | 'menuItemDanger';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    // Shared base styles
    const base = 'transition-all duration-150 rounded-md cursor-pointer border-none font-semibold';
    
    // Different variant styles mapped
    const variants = {
      primary: 'px-4 py-2 text-[13px] bg-accent text-white hover:bg-[#2563eb] active:scale-[0.97]',
      ghost: 'px-4 py-2 text-[13px] bg-transparent text-text-secondary hover:bg-hover-bg hover:text-text-body',
      danger: 'px-4 py-2 text-[13px] bg-transparent text-text-secondary hover:bg-danger-bg hover:text-danger active:scale-[0.97]',
      standard: 'px-4 py-2 text-[13px] bg-surface text-text-body border border-border hover:bg-hover-bg active:scale-[0.97]',
      menuItem: 'flex items-center gap-2.5 w-full py-2 px-3 text-[13px] font-medium bg-transparent text-text-body hover:bg-hover-bg rounded-sm',
      menuItemDanger: 'flex items-center gap-2.5 w-full py-2 px-3 text-[13px] font-medium bg-transparent text-danger hover:bg-danger-bg rounded-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
