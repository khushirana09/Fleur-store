import type { PropsWithChildren } from 'react'

import { cn } from '../../../lib/utils'

type ToastProps = PropsWithChildren<{
    className?: string
    title?: string
}>

export function Toast({ children, className, title = 'Notice' }: ToastProps) {
    return (
        <div className={cn('rounded-lg border border-slate-200 bg-white p-4 shadow-sm', className)}>
            <p className="mb-1 text-sm font-semibold text-slate-900">{title}</p>
            <div className="text-sm text-slate-600">{children}</div>
        </div>
    )
}