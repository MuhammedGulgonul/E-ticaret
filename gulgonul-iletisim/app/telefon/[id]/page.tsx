import { prisma } from '@/lib/prisma'
import { Battery, Shield, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import ImageSlider from '@/components/ImageSlider'

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const product = await prisma.product.findUnique({
        where: { id, category: 'PHONE' }
    });

    if (!product) {
        notFound();
    }

    // Parse images
    const images: string[] = JSON.parse(product.images || '[]');

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Images - Slider */}
                <ImageSlider
                    images={images}
                    productName={product.name}
                    condition={product.condition}
                />

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3">{product.name}</h1>
                    </div>

                    {/* Price */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                        <p className="text-sm text-slate-600 mb-1">Fiyat</p>
                        <p className="text-4xl font-black text-blue-600">
                            {Number(product.price).toLocaleString('tr-TR')} ₺
                        </p>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4">
                        {product.storage && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Depolama</p>
                                <p className="font-bold text-slate-900">{product.storage}</p>
                            </div>
                        )}
                        {product.ram && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">RAM</p>
                                <p className="font-bold text-slate-900">{product.ram}</p>
                            </div>
                        )}
                        {product.batteryHealth && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <Battery className="inline mr-2 text-green-600" size={20} />
                                <span className="text-xs text-slate-500 uppercase tracking-wider">Batarya</span>
                                <p className="font-bold text-slate-900">{product.batteryHealth}%</p>
                            </div>
                        )}
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <Shield className="inline mr-2 text-blue-600" size={20} />
                            <span className="text-xs text-slate-500 uppercase tracking-wider">Garanti</span>
                            <p className="font-bold text-slate-900">
                                {product.condition === 'NEW' ? '2 Yıl Garanti' : 'Mağaza Garantisi'}
                            </p>
                        </div>
                    </div>

                    {/* Description - moved below specs */}
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <h3 className="font-bold text-slate-900 mb-3">Ürün Açıklaması</h3>
                        <p className="text-slate-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* WhatsApp Button */}
                    <a
                        href={`https://wa.me/905551234567?text=Merhaba,%20${encodeURIComponent(product.name)}%20hakkında%20bilgi%20almak%20istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/30"
                    >
                        <MessageCircle size={24} />
                        WhatsApp ile İletişime Geç
                    </a>
                </div>
            </div>
        </div>
    )
}
