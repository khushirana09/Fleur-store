import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    secondaryAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center text-center py-20 px-8 gap-5',
                className
            )}
        >
            {/* Icon */}
            {icon && (
                <div className="text-6xl text-mauve-300 mb-2" aria-hidden="true">
                    {icon}
                </div>
            )}

            {/* Text */}
            <div className="space-y-2 max-w-sm">
                <h3 className="font-serif text-2xl font-light text-mauve-700">
                    {title}
                </h3>
                {description && (
                    <p className="text-sm text-mauve-500 leading-relaxed">{description}</p>
                )}
            </div>

            {/* Actions */}
            {(action || secondaryAction) && (
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    {action && (
                        <Button onClick={action.onClick}>{action.label}</Button>
                    )}
                    {secondaryAction && (
                        <Button variant="secondary" onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}