import { Wrench, ShoppingBag, Users, DollarSign } from "lucide-react";
import { getDashboardStats } from "../actions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminPage() {
    const stats = await getDashboardStats();

    // Fetch recent repair requests
    const recentRepairs = await prisma.repairRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        where: { status: 'PENDING' }
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Yönetim Paneli</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link href="/admin/tamir">
                    <StatCard title="Bekleyen Tamir" value={stats.repairCount.toString()} icon={<Wrench className="text-orange-500" />} />
                </Link>
                <Link href="/admin/urunler">
                    <StatCard title="Toplam Ürün" value={stats.productCount.toString()} icon={<ShoppingBag className="text-blue-500" />} />
                </Link>
                <Link href="/admin/kullanicilar">
                    <StatCard title="Kullanıcılar" value={stats.userCount.toString()} icon={<Users className="text-purple-500" />} />
                </Link>
                <StatCard title="Bu Ay Ciro" value="0 ₺" icon={<DollarSign className="text-emerald-500" />} />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-4">Son Tamir Talepleri</h2>
                    {recentRepairs.length === 0 ? (
                        <p className="text-slate-500 text-sm">Henüz beklemede olan talep yok.</p>
                    ) : (
                        <ul className="space-y-4">
                            {recentRepairs.map(request => (
                                <li key={request.id} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {request.model || 'Model belirtilmemiş'} - {request.description?.substring(0, 30) || 'Açıklama yok'}...
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {request.contactInfo || 'İletişim yok'} • {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">Bekliyor</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="font-bold text-slate-800 mb-4">Hızlı İşlemler</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-slate-50 rounded-xl text-left hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="block font-bold mb-1">Yeni Ürün Ekle</span>
                            <span className="text-xs opacity-70">Stok girişi yap</span>
                        </button>
                        <button className="p-4 bg-slate-50 rounded-xl text-left hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="block font-bold mb-1">Duyuru Yayınla</span>
                            <span className="text-xs opacity-70">Site başlığında</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                {icon}
            </div>
        </div>
    )
}
