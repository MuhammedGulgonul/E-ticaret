'use client'

import { useState } from 'react'
import { ShoppingBag, Star, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { addToCart } from '@/app/cart-actions'

interface Product {
    id: number
    name: string
    price: number
    category: string
    subCategory: string | null
    images: string
    stock: number
}

interface AccessoryFeedProps {
    products: Product[]
}

const categories = [
    { id: 'ALL', label: 'Tümü' },
    { id: 'CASE', label: 'Kılıf / Kapak' },
    { id: 'CHARGER', label: 'Şarj' },
    { id: 'SCREEN_PROTECTOR', label: 'Ekran Koruyucu' },
    { id: 'HEADPHONE', label: 'Kulaklık' },
    { id: 'OTHER', label: 'Diğer' }
]

export default function AccessoryFeed({ products: initialProducts }: AccessoryFeedProps) {
    const [selectedCategory, setSelectedCategory] = useState('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredProducts = filterProducts(initialProducts, selectedCategory, searchQuery)

    async function handleAddToCart(productId: number) {
        const result = await addToCart(productId, 1)
        if (result.success) {
            // Silently reload to update cart count
            window.location.reload()
        } else {
            // Only show error alerts
            alert('❌ ' + result.message)
        }
    }

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const count = cat.id === 'ALL'
                                ? initialProducts.length
                                : initialProducts.filter(p => p.subCategory === cat.id).length

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2.5 rounded-xl font-medium transition-all ${selectedCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {cat.label} {count > 0 && `(${count})`}
                                </button>
                            )
                        })}
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Ürün ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const images = JSON.parse(product.images || '[]')
                        const firstImage = images[0]

                        return (
                            <div key={product.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <Link href={`/aksesuar/${product.id}`} className="relative aspect-square bg-slate-50 block overflow-hidden">
                                    {firstImage ? (
                                        <Image
                                            src={firstImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingBag className="w-20 h-20 text-slate-200" />
                                        </div>
                                    )}
                                    {product.subCategory && (
                                        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur px-2 py-1 rounded-md text-slate-500 shadow-sm">
                                            {categories.find(c => c.id === product.subCategory)?.label || product.subCategory}
                                        </span>
                                    )}
                                </Link>

                                <div className="p-5">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="text-xs text-slate-300 ml-1">(0)</span>
                                    </div>
                                    <Link href={`/aksesuar/${product.id}`}>
                                        <h2 className="text-base font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
                                            {product.name}
                                        </h2>
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-slate-900">
                                            {Number(product.price).toLocaleString('tr-TR')} ₺
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-110 transition-all duration-200 shadow-lg shadow-blue-600/20 cursor-pointer"
                                        >
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-24 h-24 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Ürün bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function filterProducts(products: Product[], category: string, query: string) {
    let filtered = products

    if (category !== 'ALL') {
        filtered = filtered.filter(p => p.subCategory === category)
    }

    if (query) {
        const lowerQuery = query.toLowerCase()
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.subCategory?.toLowerCase().includes(lowerQuery)
        )
    }

    return filtered
}
