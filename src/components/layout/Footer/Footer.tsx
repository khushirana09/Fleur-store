import { Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import toast from 'react-hot-toast'

const FOOTER_COLUMNS = [
    {
        title: 'Shop',
        links: [
            { label: 'New In', href: `${ROUTES.SHOP}?sort=newest` },
            { label: 'Kurtas & Suits', href: `${ROUTES.SHOP}?category=kurtas` },
            { label: 'Dresses', href: `${ROUTES.SHOP}?category=dresses` },
            { label: 'Sarees & Lehengas', href: `${ROUTES.SHOP}?category=sarees` },
            { label: 'Accessories', href: `${ROUTES.SHOP}?category=accessories` },
            { label: 'Sale', href: `${ROUTES.SHOP}?sort=price-asc` },
        ],
    },
    {
        title: 'Help',
        links: [
            { label: 'Size Guide', href: '#' },
            { label: 'Returns & Exchange', href: '#' },
            { label: 'Track Your Order', href: '#' },
            { label: 'Shipping Info', href: '#' },
            { label: 'Contact Us', href: '#' },
            { label: 'WhatsApp Support', href: '#' },
        ],
    },
    {
        title: 'Fleur',
        links: [
            { label: 'Our Story', href: '#' },
            { label: 'Sustainability', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Press', href: '#' },
            { label: 'Gift Cards', href: '#' },
            { label: 'Affiliate Program', href: '#' },
        ],
    },
]

const TRUST_BADGES = [
    { icon: '🚚', title: 'Free Delivery', desc: 'Orders above ₹999' },
    { icon: '↩', title: 'Easy Returns', desc: '7-day hassle-free returns' },
    { icon: '🌸', title: '100% Authentic', desc: 'Curated & quality-checked' },
    { icon: '🔒', title: 'Secure Payment', desc: 'UPI, cards & COD accepted' },
]

export function Footer() {
    const [email, setEmail] = useState('')

    function handleSubscribe(e: React.FormEvent) {
        e.preventDefault()
        if (!email.trim()) return
        toast.success("You're on the list! 🌸 Watch your inbox for new drops.", { duration: 4000 })
        setEmail('')
    }

    return (
        <footer className="border-t border-rose-100 mt-20 bg-cream-50">

            {/* Trust badges */}
            <div className="border-b border-rose-100">
                <div className="container-app">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-rose-100">
                        {TRUST_BADGES.map(({ icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-3 px-6 py-5">
                                <span className="text-2xl flex-shrink-0">{icon}</span>
                                <div>
                                    <p className="text-[12px] font-medium text-mauve-800">{title}</p>
                                    <p className="text-[11px] text-mauve-400 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="container-app py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🌸</span>
                            <span className="font-serif text-2xl text-rose-700 font-normal tracking-wide">
                                Fleur
                            </span>
                        </Link>
                        <p className="text-sm text-mauve-500 leading-relaxed max-w-[260px]">
                            Fashion for every Indian woman — from daily kurtas to bridal lehengas.
                            Celebrate yourself, every single day.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            <a href="https://instagram.com/fleur.india" target="_blank" rel="noreferrer"
                                aria-label="Follow Fleur on Instagram"
                                className="w-8 h-8 border border-rose-200 rounded-full flex items-center
                                                     justify-center text-mauve-400 hover:text-rose-600 hover:border-rose-300
                                                     transition-colors">
                                <span className="text-xs font-bold">IG</span>                            </a>
                            <a href="#" aria-label="Fleur on YouTube"
                                className="w-8 h-8 border border-rose-200 rounded-full flex items-center
                                                     justify-center text-mauve-400 hover:text-rose-600 hover:border-rose-300
                                                     transition-colors">
                                <span className="text-xs font-bold">YT</span>
                            </a>
                            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                                aria-label="WhatsApp us"
                                className="w-8 h-8 border border-rose-200 rounded-full flex items-center
                                                     justify-center text-mauve-400 hover:text-rose-600 hover:border-rose-300
                                                     transition-colors text-sm font-bold">
                                W
                            </a>
                        </div>

                        {/* Payment icons */}
                        <div className="mt-5">
                            <p className="text-[10px] tracking-[0.1em] uppercase text-mauve-400 mb-2">
                                We accept
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {['UPI', 'Visa', 'Mastercard', 'COD', 'EMI'].map((p) => (
                                    <span key={p}
                                        className="text-[10px] px-2.5 py-1 bg-white border border-rose-100
                                                             rounded text-mauve-500 font-medium">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Link columns */}
                    {FOOTER_COLUMNS.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-[11px] tracking-[0.12em] uppercase text-mauve-700
                                                         font-medium mb-4">
                                {col.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {col.links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link to={href}
                                            className="text-sm text-mauve-400 hover:text-rose-600 transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-10 border-t border-rose-100">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7">
                        <div>
                            <h3 className="font-serif text-xl text-mauve-900 font-normal">
                                Get early access to new drops 🌸
                            </h3>
                            <p className="text-sm text-mauve-400 mt-1">
                                New arrivals, exclusive sales, and style tips — straight to your inbox.
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="flex-1 input-base py-2.5 text-sm"
                            />
                            <button type="submit" className="btn-primary px-4 py-2.5" aria-label="Subscribe">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-rose-100">
                <div className="container-app py-5 flex flex-col sm:flex-row items-center
                                                justify-between gap-3">
                    <p className="text-[12px] text-mauve-400">
                        © {new Date().getFullYear()} Fleur Fashion Pvt. Ltd. · Made with 🌸 in India
                    </p>
                    <div className="flex items-center gap-5">
                        {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((l) => (
                            <a key={l} href="#"
                                className="text-[12px] text-mauve-400 hover:text-rose-600 transition-colors">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}