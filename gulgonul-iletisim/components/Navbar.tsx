'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Smartphone, Headphones, Wrench, User, LogIn, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
    const [session, setSession] = useState<any>(null)
    const [cartCount, setCartCount] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        loadSession()

        // Reload session when page becomes visible (tab switching)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadSession()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        // Periodic session check (every 30 seconds)
        const interval = setInterval(loadSession, 30000)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            clearInterval(interval)
        }
    }, [])

    async function loadSession() {
        try {
            const response = await fetch('/api/session', { cache: 'no-store' })
            const data = await response.json()
            if (data.session) {
                setSession(data.session)
                const cartResponse = await fetch('/api/cart-count', { cache: 'no-store' })
                const cartData = await cartResponse.json()
                setCartCount(cartData.count || 0)
            } else {
                setSession(null)
                setCartCount(0)
            }
        } catch (error) {
            console.error('Session load error:', error)
            setSession(null)
            setCartCount(0)
        }
    }

    if (!mounted) {
        return null
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all">
            <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                        <Image
                            src="/logo.png"
                            alt="Gülgönül İletişim Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-xl font-bold leading-none text-blue-900">
                            Gülgönül
                        </span>
                        <span className="text-sm font-medium leading-none text-cyan-500 tracking-wider">
                            İLETİŞİM
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-2 mx-auto">
                    <NavLink href="/" text="Anasayfa" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} />
                    <NavLink href="/telefon" text="Telefonlar" icon={<Smartphone size={18} />} />
                    <NavLink href="/aksesuar" text="Aksesuarlar" icon={<Headphones size={18} />} />
                    <NavLink href="/tamir" text="Teknik Servis" icon={<Wrench size={18} />} />
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Cart */}
                    <Link href="/sepet" className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {session ? (
                        <>
                            {/* Admin Panel Button */}
                            {session.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all font-bold shadow-lg shadow-purple-600/20"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="9" y1="3" x2="9" y2="21"></line>
                                    </svg>
                                    <span className="hidden lg:inline">Admin Panel</span>
                                </Link>
                            )}

                            {/* User Account */}
                            <Link
                                href="/hesap"
                                className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                            >
                                <User size={20} />
                                <span className="hidden lg:inline">{session.name || 'Hesabım'}</span>
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all font-bold shadow-lg shadow-blue-600/20"
                        >
                            <LogIn size={20} />
                            <span>Giriş Yap</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    aria-label="Menü"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                        <MobileNavLink href="/" text="Anasayfa" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>} onClick={() => setMobileMenuOpen(false)} />
                        <MobileNavLink href="/telefon" text="Telefonlar" icon={<Smartphone size={18} />} onClick={() => setMobileMenuOpen(false)} />
                        <MobileNavLink href="/aksesuar" text="Aksesuarlar" icon={<Headphones size={18} />} onClick={() => setMobileMenuOpen(false)} />
                        <MobileNavLink href="/tamir" text="Teknik Servis" icon={<Wrench size={18} />} onClick={() => setMobileMenuOpen(false)} />

                        <div className="border-t border-slate-100 my-2"></div>

                        <MobileNavLink href="/sepet" text={`Sepet (${cartCount})`} icon={<ShoppingCart size={18} />} onClick={() => setMobileMenuOpen(false)} />

                        {session ? (
                            <>
                                {session.role === 'ADMIN' && (
                                    <MobileNavLink href="/admin" text="Admin Panel" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>} onClick={() => setMobileMenuOpen(false)} />
                                )}
                                <MobileNavLink href="/hesap" text={session.name || 'Hesabım'} icon={<User size={18} />} onClick={() => setMobileMenuOpen(false)} />
                            </>
                        ) : (
                            <MobileNavLink href="/login" text="Giriş Yap" icon={<LogIn size={18} />} onClick={() => setMobileMenuOpen(false)} />
                        )}
                    </nav>
                </div>
            )}
        </header>
    )
}

function NavLink({ href, text, icon }: { href: string; text: string; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
        >
            {icon}
            <span>{text}</span>
        </Link>
    )
}

function MobileNavLink({ href, text, icon, onClick }: { href: string; text: string; icon?: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all font-medium"
        >
            {icon}
            <span>{text}</span>
        </Link>
    )
}
