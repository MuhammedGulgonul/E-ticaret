import { prisma } from '@/lib/prisma'
import { Users, UserPlus } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Kullanıcı Yönetimi</h1>
                <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <UserPlus size={20} /> Yeni Kullanıcı
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                {users.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-xl">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">Henüz kayıtlı kullanıcı yok.</h3>
                        <p className="text-slate-500 mt-2">İlk kullanıcıyı eklemek için yukarıdaki butona tıklayın.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                                <th className="p-4 font-semibold">Ad Soyad</th>
                                <th className="p-4 font-semibold">E-posta</th>
                                <th className="p-4 font-semibold">Rol</th>
                                <th className="p-4 font-semibold">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-700">{user.name}</td>
                                    <td className="p-4 text-slate-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
