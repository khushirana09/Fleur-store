import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type StarSize = 'xs' | 'sm' | 'md'

export interface StarRatingProps {
    rating: number
    reviewCount?: number
    size?: StarSize
    className?: string
    showNumber?: boolean
}

const sizePx: Record<StarSize, number> = { xs: 10, sm: 12, md: 16 }

export function StarRating({
    rating,
    reviewCount,
    size = 'sm',
    className,
    showNumber = false,
}: StarRatingProps) {
    const px = sizePx[size]
    const rounded = Math.round(rating * 2) / 2   // nearest 0.5

    return (
        <div
            className={cn('flex items-center gap-1.5', className)}
            aria-label={`Rating: ${rating} out of 5${reviewCount !== undefined ? `, ${reviewCount} reviews` : ''}`}
        >
            {/* Stars */}
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => {
                    const filled = i < Math.floor(rounded)
                    const half = !filled && i < rounded

                    return (
                        <Star
                            key={i}
                            size={px}
                            aria-hidden="true"
                            className={cn(
                                filled
                                    ? 'fill-rose-400 text-rose-400'
                                    : half
                                        ? 'fill-rose-400/50 text-rose-400'
                                        : 'fill-transparent text-mauve-300'
                            )}
                        />
                    )
                })}
            </div>

            {/* Numeric rating */}
            {showNumber && (
                <span
                    className={cn(
                        'font-medium text-mauve-700',
                        size === 'xs' ? 'text-[10px]' : size === 'sm' ? 'text-[11px]' : 'text-xs'
                    )}
                >
                    {rating.toFixed(1)}
                </span>
            )}

            {/* Review count */}
            {reviewCount !== undefined && (
                <span
                    className={cn(
                        'text-mauve-500',
                        size === 'xs' ? 'text-[10px]' : size === 'sm' ? 'text-[11px]' : 'text-xs'
                    )}
                >
                    ({reviewCount.toLocaleString('en-IN')})
                </span>
            )}
        </div>
    )
}