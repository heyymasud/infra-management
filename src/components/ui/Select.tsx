import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-[5px]", className)}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            "px-3 py-[9px] text-[13px] text-text-body bg-surface border rounded-md outline-none transition-all duration-150",
            error 
              ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
