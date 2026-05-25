import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils/cn'

/* ─── Types ──────────────────────────────────────────────── */

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    /** Render a full-width block (default true) */
    block?: boolean
}

/* ─── Component ─────────────────────────────────────────── */

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon,
            rightIcon,
            className,
            block = true,
            id,
            ...props
        },
        ref
    ) => {
        const uid = useId()
        const inputId = id ?? uid
        const hasError = !!error

        return (
            <div className={cn('flex flex-col gap-1.5', block && 'w-full')}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-[11px] tracking-[0.08em] uppercase text-mauve-600 select-none"
                    >
                        {label}
                        {props.required && (
                            <span className="text-rose-400 ml-0.5" aria-hidden="true">
                                *
                            </span>
                        )}
                    </label>
                )}

                {/* Input wrapper */}
                <div className="relative flex items-center">
                    {/* Left icon */}
                    {leftIcon && (
                        <span
                            className="absolute left-3 flex items-center text-mauve-500 pointer-events-none"
                            aria-hidden="true"
                        >
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError
                                ? `${inputId}-error`
                                : hint
                                    ? `${inputId}-hint`
                                    : undefined
                        }
                        className={cn(
                            // Base
                            'w-full bg-cream-100 border rounded px-4 py-2.5',
                            'text-sm text-mauve-800 placeholder:text-mauve-500',
                            'transition-colors duration-200',
                            'focus:outline-none focus:ring-0',
                            // Border states
                            hasError
                                ? 'border-red-500 focus:border-red-400'
                                : 'border-rose-100 focus:border-rose-400',
                            // Icon padding
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            // Disabled
                            props.disabled && 'opacity-50 cursor-not-allowed',
                            className
                        )}
                        {...props}
                    />

                    {/* Right icon */}
                    {rightIcon && (
                        <span
                            className="absolute right-3 flex items-center text-mauve-500"
                            aria-hidden="true"
                        >
                            {rightIcon}
                        </span>
                    )}
                </div>

                {/* Error message */}
                {hasError && (
                    <p
                        id={`${inputId}-error`}
                        role="alert"
                        className="text-[11px] text-red-400 flex items-center gap-1"
                    >
                        <span aria-hidden="true">✕</span>
                        {error}
                    </p>
                )}

                {/* Hint text */}
                {hint && !hasError && (
                    <p id={`${inputId}-hint`} className="text-[11px] text-mauve-500">
                        {hint}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'