import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { APP_CONFIG } from '@/lib/constants/config'

interface PageWrapperProps {
    title?: string
    description?: string
    ogImage?: string
    canonical?: string
    children: React.ReactNode
}

export function PageWrapper({ title, description, ogImage, canonical, children }: PageWrapperProps) {
    const fullTitle = title
        ? `${title} — ${APP_CONFIG.name}`
        : `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`
    const metaDesc = description ?? APP_CONFIG.description

    return (
        <>
            <Helmet>
                <title>{fullTitle}</title>
                <meta name="description" content={metaDesc} />
                {canonical && <link rel="canonical" href={canonical} />}
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={metaDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_IN" />
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={metaDesc} />
            </Helmet>
            <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </>
    )
}