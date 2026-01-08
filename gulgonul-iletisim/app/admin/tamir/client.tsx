'use client'

import { useState } from 'react'
import { Search, CheckCircle, Clock, XCircle, Phone, Mail, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RepairManagementClient({ repairs }: { repairs: any[] }) {
    const [filter, setFilter] = useState('ALL')
    const router = useRouter()

    const filteredRepairs = filter === 'ALL'
        ? repairs
        : repairs.filter(r => r.status === filter);

    const statusMap: any = {
        'PENDING': { label: 'Beklemede', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
        'IN_PROGRESS': { label: 'İşlemde', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock },
        'COMPLETED': { label: 'Tamamlandı', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle },
        'CANCELLED': { label: 'İptal', color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle }
    }

    async function updateStatus(id: number, newStatus: string) {
        try {
            const response = await fetch('/api/repair/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            })

            if (response.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Status update error:', error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-2 mb-6">
                {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {status === 'ALL' ? 'Tümü' : statusMap[status]?.label || status}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                            <th className="p-4 font-semibold">Cihaz</th>
                            <th className="p-4 font-semibold">Müşteri</th>
                            <th className="p-4 font-semibold">İletişim</th>
                            <th className="p-4 font-semibold">Sorun</th>
                            <th className="p-4 font-semibold">Durum</th>
                            <th className="p-4 font-semibold">Tarih</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredRepairs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">
                                    Bu kategoride tamir talebi bulunmuyor.
                                </td>
                            </tr>
                        ) : (
                            filteredRepairs.map(repair => {
                                const StatusInfo = statusMap[repair.status] || { label: repair.status, color: 'bg-slate-100', icon: Clock };
                                const Icon = StatusInfo.icon;

                                return (
                                    <tr key={repair.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-700">{repair.model || 'Model belirtilmemiş'}</td>
                                        <td className="p-4">
                                            {repair.user ? (
                                                <div>
                                                    <p className="font-medium text-slate-700">{repair.user.name || 'İsimsiz'}</p>
                                                    <p className="text-xs text-slate-500">{repair.user.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Misafir / Hesapsız</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {repair.contactInfo || 'İletişim bilgisi yok'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={repair.description || ''}>
                                            {repair.description || 'Açıklama yok'}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={repair.status}
                                                onChange={(e) => updateStatus(repair.id, e.target.value)}
                                                className={`px-2.5 py-1 rounded-md text-xs font-bold border ${StatusInfo.color}`}
                                            >
                                                <option value="PENDING">Beklemede</option>
                                                <option value="IN_PROGRESS">İşlemde</option>
                                                <option value="COMPLETED">Tamamlandı</option>
                                                <option value="CANCELLED">İptal</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(repair.createdAt).toLocaleDateString('tr-TR')}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
