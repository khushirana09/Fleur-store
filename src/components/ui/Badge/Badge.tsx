import { cn } from '@/lib/utils/cn'

/* ─── Types ──────────────────────────────────────────────── */

type BadgeVariant =
    | 'new'
    | 'sale'
    | 'bestseller'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'default'

type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
    variant?: BadgeVariant
    size?: BadgeSize
    className?: string
    children: React.ReactNode
}

/* ─── Style maps ─────────────────────────────────────────── */

const variantStyles: Record<BadgeVariant, string> = {
    new: 'bg-rose-400 text-white',
    sale: 'bg-red-600/90 text-white',
    bestseller: 'bg-cream-200 border border-rose-200 text-rose-400',
    success: 'bg-green-900/50 border border-green-800/50 text-green-400',
    warning: 'bg-amber-900/50 border border-amber-800/50 text-amber-400',
    error: 'bg-red-900/50 border border-red-800/50 text-red-400',
    info: 'bg-blue-900/50 border border-blue-800/50 text-blue-400',
    default: 'bg-cream-200 border border-rose-200 text-mauve-600',
}

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[10px]',
}

/* ─── Component ─────────────────────────────────────────── */

export function Badge({
    variant = 'default',
    size = 'md',
    className,
    children,
}: BadgeProps) {
    const label =
        typeof children === 'string'
            ? children
            : variant === 'bestseller'
                ? 'Best Seller'
                : String(children)

    return (
        <span
            className={cn(
                'inline-flex items-center rounded tracking-[0.08em] uppercase font-medium',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {label}
        </span>
    )
}