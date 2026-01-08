import { handlePaymentCallback } from '@/app/payment-actions'
import { CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface PaymentResult {
    success: boolean
    message?: string
    paymentId?: string
}

export default async function PaymentCallbackPage({
    searchParams
}: {
    searchParams: Promise<{ token?: string }>
}) {
    const params = await searchParams
    const token = params.token

    if (!token) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-md mx-auto text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Geçersiz İstek</h1>
                    <p className="text-slate-600 mb-6">Ödeme token'ı bulunamadı.</p>
                    <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                        Anasayfaya Dön
                    </Link>
                </div>
            </div>
        )
    }

    const result = await handlePaymentCallback(token) as PaymentResult

    if (result.success) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-md mx-auto text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Ödeme Başarılı!</h1>
                    <p className="text-slate-600 mb-6">
                        Siparişiniz alındı. Kısa süre içinde kargoya verilecektir.
                    </p>
                    {'paymentId' in result && (
                        <p className="text-sm text-slate-500 mb-6">
                            Ödeme ID: {result.paymentId}
                        </p>
                    )}
                    <div className="flex gap-4 justify-center">
                        <Link href="/hesap" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                            Siparişlerimi Görüntüle
                        </Link>
                        <Link href="/" className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
                            Alışverişe Devam Et
                        </Link>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-md mx-auto text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Ödeme Başarısız</h1>
                    <p className="text-slate-600 mb-6">{result.message}</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/sepet" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                            Sepete Dön
                        </Link>
                        <Link href="/" className="px-6 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all">
                            Anasayfa
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
