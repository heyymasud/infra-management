import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-[5px]", className)}>
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-[0.04em]">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "px-3 py-[9px] text-[13px] text-text-body bg-surface border rounded-md outline-none transition-all duration-150 resize-y",
            error 
              ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
