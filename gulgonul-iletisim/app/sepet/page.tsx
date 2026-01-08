import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { removeFromCart, updateCartItemQuantity } from '@/app/cart-actions'
import CheckoutForm from '@/components/CheckoutForm'

export default async function CartPage() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: session.userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    const items = cart?.items || []
    const total = items.reduce((sum, item) => {
        return sum + (Number(item.product.price) * item.quantity)
    }, 0)

    async function handleRemove(itemId: number) {
        'use server'
        await removeFromCart(itemId)
    }

    async function handleUpdateQuantity(itemId: number, newQuantity: number) {
        'use server'
        await updateCartItemQuantity(itemId, newQuantity)
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Sepetim</h1>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl">
                    <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Sepetiniz Boş</h2>
                    <p className="text-slate-500 mb-6">Alışverişe başlamak için ürünleri keşfedin!</p>
                    <a href="/aksesuar" className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                        Alışverişe Başla
                    </a>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const images = JSON.parse(item.product.images || '[]')
                            const firstImage = images[0]

                            return (
                                <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex gap-6">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden relative flex-shrink-0">
                                        {firstImage ? (
                                            <Image src={firstImage} alt={item.product.name} fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ShoppingCart className="text-slate-300" size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 mb-1">{item.product.name}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">{item.product.description}</p>
                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                            {Number(item.product.price).toLocaleString('tr-TR')} ₺
                                        </p>
                                    </div>

                                    {/* Quantity & Remove */}
                                    <div className="flex flex-col items-end justify-between">
                                        <form action={async () => {
                                            'use server'
                                            await removeFromCart(item.id)
                                        }}>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={20} />
                                            </button>
                                        </form>

                                        <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                                            <form action={async () => {
                                                'use server'
                                                await updateCartItemQuantity(item.id, item.quantity - 1)
                                            }}>
                                                <button className="p-2 hover:bg-slate-50 transition-colors">
                                                    <Minus size={16} />
                                                </button>
                                            </form>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <form action={async () => {
                                                'use server'
                                                await updateCartItemQuantity(item.id, item.quantity + 1)
                                            }}>
                                                <button className="p-2 hover:bg-slate-50 transition-colors">
                                                    <Plus size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Sipariş Özeti</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Ürünler ({items.length})</span>
                                    <span>{total.toLocaleString('tr-TR')} ₺</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Kargo</span>
                                    <span className="text-green-600 font-medium">Ücretsiz</span>
                                </div>
                                <div className="border-t border-slate-200 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold text-slate-900">
                                        <span>Toplam</span>
                                        <span>{total.toLocaleString('tr-TR')} ₺</span>
                                    </div>
                                </div>
                            </div>

                            <CheckoutForm totalAmount={total} />

                            <p className="text-xs text-slate-400 text-center mt-4">
                                Güvenli ödeme ile alışverişinizi tamamlayın
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
