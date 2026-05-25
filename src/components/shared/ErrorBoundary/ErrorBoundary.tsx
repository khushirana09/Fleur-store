import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // In production, send to error tracking (e.g. Sentry):
        // Sentry.captureException(error, { extra: info })
        console.error('[ErrorBoundary]', error, info.componentStack)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            /* Custom fallback provided by parent */
            if (this.props.fallback) return this.props.fallback

            /* Default fallback UI */
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center">
                    <div
                        className="w-16 h-16 rounded-full bg-red-900/30 border border-red-800/50
                       flex items-center justify-center text-2xl text-red-400"
                        aria-hidden="true"
                    >
                        ⚠
                    </div>

                    <div className="space-y-2 max-w-sm">
                        <h2 className="font-serif text-2xl font-light text-dark-100">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-dark-400 leading-relaxed">
                            {this.state.error?.message ??
                                'An unexpected error occurred. Please try again.'}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={this.handleReset} variant="secondary" size="sm">
                            Try Again
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="ghost"
                            size="sm"
                        >
                            Reload Page
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}