'use client'

import { Wrench, CheckCircle, Smartphone, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { submitRepairRequest } from '../actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RepairPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setMessage(null)

        const result = await submitRepairRequest(formData)

        setIsSubmitting(false)
        if (result.success) {
            setMessage({ type: 'success', text: result.message });
            (document.getElementById('repairForm') as HTMLFormElement).reset();
        } else {
            // Check if login is required
            if ('requireLogin' in result && result.requireLogin) {
                router.push('/login?redirect=/tamir')
            } else {
                setMessage({ type: 'error', text: result.message })
            }
        }
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                    <Wrench className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Tamir & Teknik Servis</h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Cihazınızdaki sorunu bize bildirin, uzman ekibimizden hızlıca fiyat teklifi alın.
                    Arızalı cihazınızı güvenle tamir edelim, ilk günkü performansına kavuşturalım.
                </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                    <div className="bg-white border text- border-slate-200 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                            <div className="w-2 h-8 bg-primary rounded-full"></div>
                            <h3 className="text-xl font-bold text-slate-900">Teklif Formu</h3>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form id="repairForm" action={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="model" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Smartphone size={16} /> Cihaz Marka & Modeli
                                </label>
                                <input
                                    name="model"
                                    type="text"
                                    id="model"
                                    required
                                    placeholder="Örn: iPhone 13 Pro"
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="issue" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <AlertCircle size={16} /> Arıza Açıklaması
                                </label>
                                <textarea
                                    name="issue"
                                    id="issue"
                                    required
                                    placeholder="Örn: Ekran kırıldı, dokunmatik çalışmıyor."
                                    rows={4}
                                    className="flex w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="contact" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Mail size={16} /> İletişim Bilgisi (Tel/Email)
                                </label>
                                <input
                                    name="contact"
                                    type="text"
                                    id="contact"
                                    required
                                    placeholder="Size ulaşabileceğimiz bir numara veya e-posta"
                                    className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Fiyat Teklifi Al'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Neden Gülgönül?</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                                <div className="text-sm text-slate-600">
                                    <strong>Hızlı Teslimat:</strong> <br />Birçok arızayı aynı gün içinde gideriyoruz.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                                <div className="text-sm text-slate-600">
                                    <strong>Orijinal Parça:</strong> <br />Cihaz ömrünü uzatan kaliteli parçalar.
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                                <div className="text-sm text-slate-600">
                                    <strong>Garantili İşlem:</strong> <br />Yaptığımız tamir işlemleri garantilidir.
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-500 p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <h3 className="font-bold mb-2 relative z-10">Sorunuz mu var?</h3>
                        <p className="text-blue-100 text-sm mb-4 relative z-10">
                            Bize WhatsApp üzerinden hemen ulaşabilirsiniz.
                        </p>
                        <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-50 transition-colors relative z-10">
                            WhatsApp'tan Yaz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
