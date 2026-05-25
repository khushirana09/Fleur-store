import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/constants/routes'

export function NotFound() {
    return (
        <PageWrapper title="Page Not Found">
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 max-w-md"
                >
                    {/* Large 404 */}
                    <p className="font-serif text-[140px] leading-none font-light text-cream-100 select-none">
                        404
                    </p>

                    <div className="space-y-3">
                        <h1 className="font-serif text-3xl font-light text-mauve-700">
                            Page not found
                        </h1>
                        <p className="text-mauve-500 text-sm leading-relaxed">
                            The page you're looking for doesn't exist or has been moved.
                            Let's get you back on track.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Button asChild>
                            <Link to={ROUTES.HOME}>Back to Home</Link>
                        </Button>
                        <Button variant="secondary" asChild>
                            <Link to={ROUTES.SHOP}>Browse Collection</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    )
}