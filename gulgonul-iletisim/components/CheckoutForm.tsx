'use client'

import { createOrder } from '@/app/order-actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, MapPin, Phone, FileText } from 'lucide-react'

export default function CheckoutForm({ totalAmount }: { totalAmount: number }) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage(null)

        const result = await createOrder(formData)

        setLoading(false)
        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setTimeout(() => {
                router.push('/hesap')
            }, 2000)
        } else {
            setMessage({ type: 'error', text: result.message })
        }
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <MapPin size={16} />
                        Teslimat Adresi *
                    </label>
                    <textarea
                        name="shippingAddress"
                        required
                        rows={3}
                        placeholder="Teslimat adresinizi yazın..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <Phone size={16} />
                        Telefon Numarası *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="05XX XXX XX XX"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                        <FileText size={16} />
                        Sipariş Notu (Opsiyonel)
                    </label>
                    <textarea
                        name="notes"
                        rows={2}
                        placeholder="Eklemek istediğiniz not..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="font-bold text-slate-900 mb-2">💳 Ödeme Yöntemi</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                            <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        <span>Kredi Kartı ile Güvenli Ödeme (iyzico)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Siparişi tamamladığınızda iyzico güvenli ödeme sayfasına yönlendirileceksiniz.
                        Kredi kartı bilgileriniz bizimle paylaşılmaz.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Sipariş Oluşturuluyor...
                        </>
                    ) : (
                        <>
                            Siparişi Tamamla - {totalAmount.toLocaleString('tr-TR')} ₺
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
