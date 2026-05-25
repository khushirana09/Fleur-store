import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface BreadcrumbItem {
    label: string
    href?: string
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
    showHome?: boolean
}

export function Breadcrumb({
    items,
    className,
    showHome = true,
}: BreadcrumbProps) {
    const allItems = showHome
        ? [{ label: 'Home', href: '/' }, ...items]
        : items

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex items-center gap-1', className)}
        >
            <ol
                className="flex items-center gap-1 text-[12px] text-mauve-500"
                /* Schema.org BreadcrumbList for SEO */
                itemScope
                itemType="https://schema.org/BreadcrumbList"
            >
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1
                    const isHome = index === 0 && showHome

                    return (
                        <li
                            key={index}
                            className="flex items-center gap-1"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {/* Separator — not shown for first item */}
                            {index > 0 && (
                                <ChevronRight
                                    size={12}
                                    className="text-mauve-300 flex-shrink-0"
                                    aria-hidden="true"
                                />
                            )}

                            {isLast ? (
                                /* Current page — not a link */
                                <span
                                    className="text-mauve-700"
                                    aria-current="page"
                                    itemProp="name"
                                >
                                    {item.label}
                                </span>
                            ) : item.href ? (
                                /* Clickable breadcrumb */
                                <Link
                                    to={item.href}
                                    className="hover:text-mauve-700 transition-colors flex items-center gap-1"
                                    itemProp="item"
                                >
                                    {isHome && (
                                        <Home size={11} aria-hidden="true" />
                                    )}
                                    <span itemProp="name">{isHome ? '' : item.label}</span>
                                </Link>
                            ) : (
                                <span itemProp="name">{item.label}</span>
                            )}

                            <meta itemProp="position" content={String(index + 1)} />
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}