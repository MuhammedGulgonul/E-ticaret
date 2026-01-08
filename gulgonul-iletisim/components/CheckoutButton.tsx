'use client'

import { createPayment } from '@/app/payment-actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Shield, CreditCard } from 'lucide-react'

interface PaymentResult {
    success: boolean
    message?: string
    paymentPageUrl?: string
}

export default function CheckoutButton({ totalAmount }: { totalAmount: number }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleCheckout() {
        setLoading(true)

        const result = await createPayment() as PaymentResult

        if (result.success && result.paymentPageUrl) {
            // İyzico'nun güvenli ödeme sayfasına yönlendir
            // Kredi kartı bilgileri bizim sunucumuza GELMİYOR!
            window.location.href = result.paymentPageUrl
        } else {
            alert(result.message || 'Bir hata oluştu')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Ödeme sayfasına yönlendiriliyor...
                    </>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Güvenli Ödeme - {totalAmount.toLocaleString('tr-TR')} ₺
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Shield size={14} className="text-green-600" />
                <span>256-bit SSL ile şifrelenen güvenli ödeme</span>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
                <p className="font-bold text-blue-900 mb-2">🔒 Güvenlik Garantisi</p>
                <ul className="text-blue-700 space-y-1 text-xs">
                    <li>✓ Kredi kartı bilgileriniz İyzico güvencesinde</li>
                    <li>✓ 3D Secure doğrulama ile ekstra güvenlik</li>
                    <li>✓ Bilgileriniz bizimle paylaşılmaz</li>
                </ul>
            </div>
        </div>
    )
}
