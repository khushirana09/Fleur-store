import { forwardRef, cloneElement, isValidElement } from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    fullWidth?: boolean
    asChild?: boolean
}

const variantStyles: Record<Variant, string> = {
    primary:
        'bg-rose-400 text-white hover:bg-rose-300 active:bg-rose-500 ' +
        'disabled:bg-rose-400/40 disabled:text-white/60',
    secondary:
        'border border-rose-200 text-mauve-700 hover:border-rose-300 hover:text-mauve-800 ' +
        'active:border-rose-300 disabled:opacity-40',
    ghost:
        'text-mauve-600 hover:text-mauve-800 hover:bg-cream-100 ' +
        'active:bg-cream-200 disabled:opacity-40',
    danger:
        'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 ' +
        'disabled:opacity-50',
    link:
        'text-rose-400 hover:text-rose-300 underline-offset-4 hover:underline ' +
        'disabled:opacity-40 p-0',
}

const sizeStyles: Record<Size, string> = {
    xs: 'px-3 py-1.5 text-[10px] gap-1',
    sm: 'px-4 py-2   text-[11px] gap-1.5',
    md: 'px-7 py-3   text-[12px] gap-2',
    lg: 'px-9 py-3.5 text-[13px] gap-2',
    xl: 'px-11 py-4  text-[14px] gap-2.5',
}

function buildClasses(
    variant: Variant,
    size: Size,
    fullWidth: boolean,
    isDisabled: boolean,
    className?: string
) {
    return cn(
        'inline-flex items-center justify-center font-sans tracking-[0.1em]',
        'uppercase font-medium rounded transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50',
        isDisabled && 'cursor-not-allowed',
        variantStyles[variant],
        variant !== 'link' && sizeStyles[size],
        fullWidth && 'w-full',
        className
    )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            asChild = false,
            children,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading
        const classes = buildClasses(variant, size, fullWidth, isDisabled, className)

        if (asChild && isValidElement(children)) {
            const child = children as React.ReactElement<{ className?: string }>
            return cloneElement(child, {
                className: cn(classes, child.props.className),
            })
        }

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                aria-busy={isLoading}
                className={classes}
                {...props}
            >
                {isLoading ? (
                    <span
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2
                       border-current border-t-transparent"
                        aria-hidden="true"
                    />
                ) : (
                    leftIcon && <span className="shrink-0">{leftIcon}</span>
                )}
                {children}
                {!isLoading && rightIcon && (
                    <span className="shrink-0">{rightIcon}</span>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'
