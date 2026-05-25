import { cn } from '@/lib/utils/cn'

/* ─── Base Skeleton ─────────────────────────────────────── */

export interface SkeletonProps {
    className?: string
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
    const roundedMap = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }

    return (
        <div
            aria-hidden="true"
            className={cn('skeleton', roundedMap[rounded], className)}
        />
    )
}

/* ─── Product Card Skeleton ─────────────────────────────── */

export function ProductCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="bg-cream-100 border border-rose-100 rounded-lg overflow-hidden"
        >
            {/* Image area */}
            <Skeleton className="aspect-[3/4] w-full" rounded="none" />

            {/* Content area */}
            <div className="p-4 space-y-2.5">
                <Skeleton className="h-2 w-1/3" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3 w-1/4 mt-1" />
                <Skeleton className="h-2.5 w-2/5 mt-1" />
            </div>
        </div>
    )
}

/* ─── Product Grid Skeleton ─────────────────────────────── */

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: count }, (_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}

/* ─── Product Detail Skeleton ───────────────────────────── */

export function ProductDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full" rounded="lg" />
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }, (_, i) => (
                        <Skeleton key={i} className="aspect-square" />
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="space-y-5 pt-4">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-8 w-1/3" />
                <div className="space-y-2 mt-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                </div>
                <div className="space-y-3 mt-6">
                    <Skeleton className="h-11 w-full" rounded="md" />
                    <Skeleton className="h-11 w-full" rounded="md" />
                </div>
            </div>
        </div>
    )
}