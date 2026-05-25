import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useScrollLock } from '@/hooks/useScrollLock'

/* ─── Types ──────────────────────────────────────────────── */

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
    open: boolean
    onClose: () => void
    title?: string
    description?: string
    size?: ModalSize
    className?: string
    children: React.ReactNode
    /** Hide the default close (X) button */
    hideClose?: boolean
}

/* ─── Style maps ─────────────────────────────────────────── */

const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw]',
}

/* ─── Component ─────────────────────────────────────────── */

export function Modal({
    open,
    onClose,
    title,
    description,
    size = 'md',
    className,
    children,
    hideClose = false,
}: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null)
    useScrollLock(open)

    // Close on Escape key
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onClose])

    // Trap focus inside modal
    useEffect(() => {
        if (open) dialogRef.current?.focus()
    }, [open])

    return (
        <AnimatePresence>
            {open && (
                /* Backdrop */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby={title ? 'modal-title' : undefined}
                >
                    {/* Dim overlay */}
                    <div
                        className="absolute inset-0 bg-cream-50/80 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.div
                        ref={dialogRef}
                        tabIndex={-1}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            'relative w-full bg-cream-100 border border-rose-100',
                            'rounded-xl shadow-2xl focus:outline-none',
                            sizeStyles[size],
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || !hideClose) && (
                            <div className="flex items-start justify-between p-6 pb-0">
                                <div>
                                    {title && (
                                        <h2
                                            id="modal-title"
                                            className="font-serif text-xl font-light text-mauve-800"
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p className="mt-1 text-sm text-mauve-500">{description}</p>
                                    )}
                                </div>
                                {!hideClose && (
                                    <button
                                        onClick={onClose}
                                        aria-label="Close modal"
                                        className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center
                               rounded border border-rose-100 text-mauve-500
                               hover:text-mauve-700 hover:bg-cream-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}