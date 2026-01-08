import { prisma } from '@/lib/prisma'
import { ShoppingBag, MessageCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getSession } from '@/lib/session'
import ReviewSection from '@/components/ReviewSection'
import AddToCartButton from '@/components/AddToCartButton'

export default async function AccessoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const product = await prisma.product.findUnique({
        where: { id, category: 'ACCESSORY' },
        include: {
            reviews: {
                include: {
                    user: {
                        select: { name: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!product) {
        notFound();
    }

    const session = await getSession()
    const isLoggedIn = !!session

    const images = JSON.parse(product.images || '[]');
    const firstImage = images[0];

    const categoryLabels: any = {
        'CASE': 'Kılıf / Kapak',
        'CHARGER': 'Şarj Aleti / Kablo',
        'SCREEN_PROTECTOR': 'Ekran Koruyucu',
        'HEADPHONE': 'Kulaklık',
        'OTHER': 'Diğer'
    };

    // Format reviews for client component
    const formattedReviews = product.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
            name: r.user.name
        }
    }))

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="bg-slate-50 rounded-3xl overflow-hidden aspect-square relative flex items-center justify-center p-12">
                    {firstImage ? (
                        <Image
                            src={firstImage}
                            alt={product.name}
                            fill
                            className="object-contain p-8"
                            unoptimized
                        />
                    ) : (
                        <ShoppingBag className="w-32 h-32 text-slate-300" />
                    )}
                    {/* Category Badge */}
                    {product.subCategory && (
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm rounded-lg text-slate-600 shadow-lg border border-slate-100">
                                {categoryLabels[product.subCategory] || product.subCategory}
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">{product.name}</h1>
                        <p className="text-slate-600">{product.description}</p>
                    </div>

                    {/* Stock */}
                    <div className="p-4 bg-slate-50 rounded-xl inline-block">
                        <p className="text-xs text-slate-500 mb-1">Stok Durumu</p>
                        <p className="text-lg font-bold text-slate-900">{product.stock} adet mevcut</p>
                    </div>

                    {/* Price - Blue Theme */}
                    <div className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-600/20 text-center">
                        <p className="text-xs opacity-80 mb-1">Satış Fiyatı</p>
                        <p className="text-3xl font-black">{Number(product.price).toLocaleString('tr-TR')} ₺</p>
                    </div>

                    {/* Add to Cart & WhatsApp */}
                    <div className="flex gap-4">
                        <AddToCartButton productId={product.id} />
                        <a
                            href={`https://wa.me/905555555555?text=Merhaba, ${product.name} hakkında bilgi almak istiyorum.`}
                            target="_blank"
                            className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center"
                        >
                            <MessageCircle size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection
                productId={product.id}
                initialReviews={formattedReviews}
                isLoggedIn={isLoggedIn}
            />
        </div>
    )
}
