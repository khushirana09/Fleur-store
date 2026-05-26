import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ProductCard } from '@/components/shared/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useAppDispatch } from '@/app/hooks'
import { setActiveCategory } from '@/features/products/productsSlice'
import { useFeaturedProducts, useNewArrivals } from '@/features/products/hooks/useProducts'
import { ROUTES } from '@/lib/constants/routes'
import { CATEGORY_EMOJIS, CATEGORY_LABELS } from '@/lib/constants/config'

const CATEGORIES = ['kurtas', 'dresses', 'sarees', 'tops', 'bottoms', 'accessories']

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.55, ease: 'easeInOut' as const },
    },
}

const TESTIMONIALS = [
    { name: 'Priya S.', city: 'Mumbai', text: 'Got the Anarkali set for Diwali — literally everyone asked where I got it!', rating: 5 },
    { name: 'Ananya R.', city: 'Bangalore', text: 'Quality is so good for the price. The saree dupatta is gorgeous in person.', rating: 5 },
    { name: 'Sneha K.', city: 'Delhi', text: 'Ordered the coord set and it fit perfectly. Super fast delivery too!', rating: 5 },
]

export function Home() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { data: featured, isLoading: featLoading } = useFeaturedProducts()
    const { data: newItems, isLoading: newLoading } = useNewArrivals()

    function goToCategory(cat: string) {
        dispatch(setActiveCategory(cat))
        navigate(ROUTES.SHOP)
    }

    return (
        <PageWrapper
            title="Women's Fashion India"
            description="Fleur — Kurtas, dresses, sarees & more. Free delivery above ₹999. Shop the latest women's fashion in India."
        >

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 min-h-[88vh] flex items-center">
                {/* Decorative background petals */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[
                        { top: '10%', left: '5%', size: 120, opacity: 0.12, delay: 0 },
                        { top: '65%', left: '2%', size: 80, opacity: 0.08, delay: 1 },
                        { top: '20%', right: '8%', size: 160, opacity: 0.10, delay: 0.5 },
                        { top: '70%', right: '4%', size: 100, opacity: 0.09, delay: 1.5 },
                        { top: '45%', right: '20%', size: 60, opacity: 0.07, delay: 2 },
                    ].map((p, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: [0, 15, 0], scale: [1, 1.05, 1] }}
                            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' as const, delay: p.delay }}
                            className="absolute text-rose-300"
                            style={{
                                top: p.top, left: (p as any).left, right: (p as any).right,
                                fontSize: p.size, opacity: p.opacity, lineHeight: 1
                            }}
                        >
                            🌸
                        </motion.div>
                    ))}
                </div>

                <div className="container-app relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

                        {/* Left copy */}
                        <div className="space-y-7">
                            <motion.div
                                variants={fadeUp} initial="hidden" animate="visible" custom={0}
                                className="inline-flex items-center gap-2 bg-rose-100 border border-rose-200
                           text-rose-700 text-[11px] tracking-widest uppercase rounded-full
                           px-4 py-1.5 font-medium"
                            >
                                <Sparkles size={12} />
                                New collection — Spring 2025
                            </motion.div>

                            <motion.h1
                                variants={fadeUp} initial="hidden" animate="visible" custom={1}
                                className="font-serif font-normal text-mauve-900 leading-[1.06]"
                                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
                            >
                                Fashion That Feels
                                <br />
                                <em className="not-italic text-rose-500">Like You</em>
                            </motion.h1>

                            <motion.p
                                variants={fadeUp} initial="hidden" animate="visible" custom={2}
                                className="text-mauve-500 text-base leading-relaxed max-w-md"
                            >
                                From everyday kurtas to bridal lehengas — Fleur brings you women's
                                fashion that celebrates every version of you. Proudly Indian. Delivered to your door.
                            </motion.p>

                            <motion.div
                                variants={fadeUp} initial="hidden" animate="visible" custom={3}
                                className="flex flex-wrap gap-3"
                            >
                                <Button size="lg" rightIcon={<ArrowRight size={16} />}
                                    onClick={() => navigate(ROUTES.SHOP)}>
                                    Shop Now
                                </Button>
                                <Button variant="secondary" size="lg"
                                    onClick={() => navigate(`${ROUTES.SHOP}?sort=newest`)}>
                                    New Arrivals
                                </Button>
                            </motion.div>

                            {/* Social proof */}
                            <motion.div
                                variants={fadeUp} initial="hidden" animate="visible" custom={4}
                                className="flex items-center gap-4 pt-2"
                            >
                                <div className="flex -space-x-2">
                                    {['👩🏻', '👩🏽', '👩🏾', '👩🏼'].map((e, i) => (
                                        <div key={i}
                                            className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white
                                 flex items-center justify-center text-sm">
                                            {e}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className="fill-rose-400 text-rose-400" />
                                        ))}
                                        <span className="text-sm font-medium text-mauve-700 ml-1">4.8</span>
                                    </div>
                                    <p className="text-[11px] text-mauve-400">Loved by 50,000+ women across India</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:flex items-center justify-center"
                        >
                            <div className="relative w-full max-w-sm">
                                {/* Main product card */}
                                <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm">
                                    <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-100
                                  rounded-2xl flex items-center justify-center text-[120px]
                                  mb-4 animate-petal">
                                        🥻
                                    </div>
                                    <div>
                                        <p className="text-[10px] tracking-wider uppercase text-rose-400 mb-1">Zari & Co.</p>
                                        <p className="font-medium text-mauve-900 text-sm">Chanderi Silk Saree</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-serif text-lg text-rose-600">₹3,499</span>
                                                <span className="text-xs text-mauve-400 line-through">₹4,999</span>
                                            </div>
                                            <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5
                                       rounded-full font-medium">30% off</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating card 1 */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
                                    className="absolute -top-4 -right-6 bg-white border border-rose-100
                             rounded-2xl px-4 py-3 shadow-sm"
                                >
                                    <p className="text-[10px] text-mauve-400">New drop 🌸</p>
                                    <p className="text-sm font-medium text-mauve-800 mt-0.5">Anarkali Set</p>
                                    <p className="font-serif text-rose-500 text-sm">₹1,899</p>
                                </motion.div>

                                {/* Floating card 2 */}
                                <motion.div
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
                                    className="absolute -bottom-4 -left-6 bg-white border border-rose-100
                             rounded-2xl px-4 py-3 shadow-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">📦</span>
                                        <div>
                                            <p className="text-[10px] text-mauve-400">Just delivered</p>
                                            <p className="text-xs font-medium text-mauve-800">Mumbai · 2 hrs ago</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ── */}
            <section className="border-y border-rose-100 bg-white" aria-label="Shop by category">
                <div className="container-app">
                    <div className="grid grid-cols-3 lg:grid-cols-6">
                        {CATEGORIES.map((cat, i) => (
                            <motion.button
                                key={cat}
                                variants={fadeUp} initial="hidden" whileInView="visible"
                                viewport={{ once: true }} custom={i * 0.3}
                                onClick={() => goToCategory(cat)}
                                className="flex flex-col items-center gap-2.5 py-7 px-3 text-center
                           hover:bg-rose-50 transition-colors group border-r border-rose-100
                           last:border-r-0"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                    {CATEGORY_EMOJIS[cat]}
                                </span>
                                <span className="text-[11px] tracking-[0.06em] uppercase text-mauve-500
                                 group-hover:text-rose-600 transition-colors font-medium">
                                    {CATEGORY_LABELS[cat].split(' ')[0]}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURED ── */}
            <section className="container-app section-py" aria-label="Featured products">
                <div className="flex items-end justify-between mb-10">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <p className="text-label text-rose-400 mb-2">Hand-picked for you</p>
                        <h2 className="heading-section">
                            Most <em className="not-italic text-rose-500">Loved</em>
                        </h2>
                    </motion.div>
                    <Link to={ROUTES.SHOP}
                        className="hidden sm:flex items-center gap-1.5 text-[12px] tracking-[0.06em]
                       uppercase text-rose-500 hover:text-rose-700 transition-colors">
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {featLoading
                        ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
                        : featured?.slice(0, 4).map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                </div>
            </section>

            {/* ── BANNER ── */}
            <section className="container-app pb-20">
                <motion.div
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="bg-rose-500 rounded-3xl px-8 lg:px-16 py-14
                     flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative"
                >
                    <div className="absolute right-0 top-0 bottom-0 pointer-events-none overflow-hidden opacity-10">
                        <div className="text-[300px] leading-none text-white font-serif">🌸</div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-rose-100 text-[11px] tracking-[0.12em] uppercase mb-3 font-medium">
                            Limited time
                        </p>
                        <h2 className="font-serif text-white font-normal leading-tight"
                            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                            Up to 40% off on
                            <br />Festive Favourites
                        </h2>
                        <p className="text-rose-100 text-sm mt-3 max-w-sm">
                            Anarkalis, sarees, and lehengas — all your favourite Indian wear, now at their best prices.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <button
                            onClick={() => navigate(`${ROUTES.SHOP}?sort=price-asc`)}
                            className="bg-white text-rose-600 font-sans text-[12px] tracking-[0.08em]
                         uppercase font-medium px-8 py-3.5 rounded-full hover:bg-rose-50
                         transition-colors flex items-center gap-2"
                        >
                            Shop Sale <ArrowRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ── NEW ARRIVALS ── */}
            <section className="container-app pb-20" aria-label="New arrivals">
                <div className="flex items-end justify-between mb-10">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <p className="text-label text-rose-400 mb-2 flex items-center gap-1.5">
                            <Sparkles size={12} /> Just landed
                        </p>
                        <h2 className="heading-section">
                            New <em className="not-italic text-rose-500">Arrivals</em>
                        </h2>
                    </motion.div>
                    <Link to={`${ROUTES.SHOP}?sort=newest`}
                        className="hidden sm:flex items-center gap-1.5 text-[12px] tracking-[0.06em]
                       uppercase text-rose-500 hover:text-rose-700 transition-colors">
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {newLoading
                        ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
                        : newItems?.slice(0, 4).map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="bg-rose-50 border-y border-rose-100 py-16" aria-label="Customer reviews">
                <div className="container-app">
                    <motion.div
                        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <p className="text-label text-rose-400 mb-2">Real customers, real love</p>
                        <h2 className="heading-section">What Our Girls Say 🌸</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={t.name}
                                variants={fadeUp} initial="hidden" whileInView="visible"
                                viewport={{ once: true }} custom={i * 0.2}
                                className="bg-white border border-rose-100 rounded-2xl p-6 space-y-3"
                            >
                                <div className="flex items-center gap-1">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={13} className="fill-rose-400 text-rose-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-mauve-600 leading-relaxed italic">"{t.text}"</p>
                                <div>
                                    <p className="text-sm font-medium text-mauve-800">{t.name}</p>
                                    <p className="text-[11px] text-mauve-400">{t.city}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY FLEUR ── */}
            <section className="container-app section-py text-center">
                <motion.div
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="max-w-xl mx-auto space-y-5"
                >
                    <p className="text-label text-rose-400">Why Fleur?</p>
                    <h2 className="heading-section">
                        Fashion That Fits <em className="not-italic text-rose-500">Every Life</em>
                    </h2>
                    <p className="text-mauve-500 text-sm leading-relaxed">
                        We believe every Indian woman deserves clothes that make her feel confident —
                        whether she's heading to the office, a pooja, a date, or just staying home.
                        Fleur is for all of those days.
                    </p>
                    <Button onClick={() => navigate(ROUTES.SHOP)}>
                        Explore the Collection
                    </Button>
                </motion.div>
            </section>

        </PageWrapper>
    )
}