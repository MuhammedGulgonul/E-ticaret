import { Smartphone, Battery, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic';

export default async function PhonesPage() {
    const phones = await prisma.product.findMany({
        where: { category: 'PHONE' },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
                <div className="w-full">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Telefonlar</h1>
                    <p className="text-slate-500 text-center">En güncel akıllı telefon modelleri ve fırsatlar.</p>
                </div>
            </div>

            {phones.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl">
                    <Smartphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">Henüz ürün bulunmuyor.</h3>
                    <p className="text-slate-500">Lütfen daha sonra tekrar kontrol ediniz.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {phones.map((phone: any) => {
                        const images = JSON.parse(phone.images || '[]')
                        const firstImage = images[0]

                        return (
                            <div key={phone.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                <Link href={`/telefon/${phone.id}`} className="block aspect-[4/3] bg-slate-100 relative overflow-hidden cursor-pointer group-hover:opacity-90 transition-opacity">
                                    {firstImage ? (
                                        <Image
                                            src={firstImage}
                                            alt={phone.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <Smartphone size={48} strokeWidth={1} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm backdrop-blur-sm ${phone.condition === 'NEW'
                                            ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100'
                                            : 'bg-amber-50/90 text-amber-600 border-amber-100'
                                            }`}>
                                            {phone.condition === 'NEW' ? 'SIFIR' : 'İKİNCİ EL'}
                                        </span>
                                        {phone.storage && (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-slate-600 border border-slate-100 shadow-sm backdrop-blur-sm">
                                                {phone.storage}
                                            </span>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-6">
                                    <Link href={`/telefon/${phone.id}`}>
                                        <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-1" title={phone.name}>{phone.name}</h2>
                                    </Link>

                                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-4 h-6">
                                        {phone.ram && (
                                            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                                {phone.ram} RAM
                                            </span>
                                        )}
                                        {phone.condition !== 'NEW' && phone.batteryHealth && (
                                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                                <Battery size={12} />
                                                %{phone.batteryHealth}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-medium">Satış Fiyatı</span>
                                            <span className="text-2xl font-black text-primary tracking-tight">
                                                {Number(phone.price).toLocaleString('tr-TR')}<span className="text-base font-bold ml-1">₺</span>
                                            </span>
                                        </div>
                                        <a
                                            href={`https://wa.me/905555555555?text=Merhaba, ${phone.name} hakkında bilgi almak istiyorum.`}
                                            target="_blank"
                                            className="p-3 bg-green-500 text-white rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
                                            aria-label="WhatsApp"
                                        >
                                            <MessageCircle size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
