import { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface SelectOption {
    value: string
    label: string
}

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    hint?: string
    options: SelectOption[]
    placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, options, placeholder, className, id, ...props }, ref) => {
        const uid = useId()
        const inputId = id ?? uid

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-[11px] tracking-[0.08em] uppercase text-mauve-600"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full appearance-none bg-cream-100 border rounded px-4 py-2.5 pr-10',
                            'text-sm text-mauve-800 transition-colors duration-200 cursor-pointer',
                            'focus:outline-none',
                            error
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-rose-100 focus:border-rose-400',
                            props.disabled && 'opacity-50 cursor-not-allowed',
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-cream-100"
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    {/* Custom chevron */}
                    <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mauve-500 pointer-events-none"
                        aria-hidden="true"
                    />
                </div>

                {error && (
                    <p className="text-[11px] text-red-400">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-[11px] text-mauve-500">{hint}</p>
                )}
            </div>
        )
    }
)

Select.displayName = 'Select'