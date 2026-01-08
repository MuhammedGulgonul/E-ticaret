'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Wrench, Users, LogOut, Settings, Package, ShoppingCart } from 'lucide-react'
import { logoutUser } from '@/app/auth-actions'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navigation = [
        { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
        { name: 'Siparişler', href: '/admin/siparisler', icon: ShoppingCart },
        { name: 'Ürün Yönetimi', href: '/admin/urunler', icon: Package },
        { name: 'Tamir Talepleri', href: '/admin/tamir', icon: Wrench },
        { name: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
        { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
    ]

    async function handleLogout() {
        await logoutUser()
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-sm hidden lg:block">
                <div className="flex flex-col h-full">
                    <div className="h-20 flex items-center px-8 border-b border-slate-100">
                        <span className="text-xl font-bold text-slate-900">Admin<span className="text-blue-600">Panel</span></span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors mb-2">
                            <ShoppingBag size={20} />
                            <span>Siteye Dön</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 w-full hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
