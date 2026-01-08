import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { User, Mail, Lock, Package } from 'lucide-react'
import { logoutUser } from '@/app/auth-actions'

export default async function AccountPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId }
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Hesabım</h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <User size={32} className="text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-500 text-sm">{user.email}</p>
                        </div>

                        <div className="space-y-2">
                            <a href="#profile" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                                Profil Bilgileri
                            </a>
                            <a href="#orders" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                                Siparişlerim
                            </a>
                            <a href="#password" className="block px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium">
                                Şifre Değiştir
                            </a>
                            <form action={logoutUser}>
                                <button className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-left">
                                    Çıkış Yap
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Info */}
                    <div id="profile" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Profil Bilgileri</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Ad Soyad</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        value={user.name || ''}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
                                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                                    {user.role === 'ADMIN' ? 'Yönetici' : 'Kullanıcı'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div id="orders" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Siparişlerim</h3>

                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">Henüz siparişiniz bulunmuyor</p>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div id="password" className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Şifre Değiştir</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Mevcut Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Yeni Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                                Şifreyi Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
