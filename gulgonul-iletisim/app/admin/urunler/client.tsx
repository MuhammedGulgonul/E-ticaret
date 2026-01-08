'use client'

import { useState, useRef } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { addProduct, updateProduct, deleteProduct } from '@/app/actions'

interface Product {
    id: number
    name: string
    description: string
    price: any
    category: string
    subCategory?: string | null
    images: string
    stock: number
    condition: string
    storage?: string | null
    ram?: string | null
    batteryHealth?: string | null
}

export default function ProductManagementClient({ products }: { products: Product[] }) {
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<'PHONE' | 'ACCESSORY'>('PHONE')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Filter & Search
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PHONE' | 'ACCESSORY'>('ALL')
    const [searchQuery, setSearchQuery] = useState('')

    // Filtered products
    const filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    function openAddModal() {
        setEditingProduct(null)
        setSelectedCategory('PHONE')
        setPreviewImages([])
        setShowModal(true)
        setMessage({ type: '', text: '' })
    }

    function openEditModal(product: Product) {
        setEditingProduct(product)
        setSelectedCategory(product.category as any)
        try {
            const images = JSON.parse(product.images || '[]')
            setPreviewImages(images)
        } catch {
            setPreviewImages([])
        }
        setShowModal(true)
        setMessage({ type: '', text: '' })
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return

        const result = await deleteProduct(id)
        if (result.success) {
            window.location.reload()
        } else {
            alert(result.message)
        }
    }

    async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Use Promise.all to properly wait for all files to be read
        const readFile = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }

        try {
            const filePromises = Array.from(files).map(file => readFile(file))
            const newImages = await Promise.all(filePromises)
            setPreviewImages([...previewImages, ...newImages])
        } catch (error) {
            console.error('Error reading files:', error)
            alert('Görsel yüklenirken hata oluştu')
        }
    }

    function removeImage(index: number) {
        setPreviewImages(previewImages.filter((_, i) => i !== index))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        const formData = new FormData(e.currentTarget)
        formData.append('images', JSON.stringify(previewImages))
        formData.append('category', selectedCategory) // Ensure category is always set

        if (editingProduct) {
            formData.append('id', editingProduct.id.toString())
        }

        const result = editingProduct
            ? await updateProduct(formData)
            : await addProduct(formData)

        setIsLoading(false)

        if (result.success) {
            setMessage({ type: 'success', text: result.message })
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } else {
            setMessage({ type: 'error', text: result.message })
        }
    }

    return (
        <>
            {/* Header with Filters */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Ürün Yönetimi</h1>
                        <p className="text-slate-500 mt-1">{filteredProducts.length} adet ürün gösteriliyor</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        Yeni Ürün Ekle
                    </button>
                </div>

                {/* Filter & Search */}
                <div className="flex gap-4">
                    {/* Category Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCategoryFilter('ALL')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'ALL'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            Tümü ({products.length})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('PHONE')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'PHONE'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            Telefonlar ({products.filter(p => p.category === 'PHONE').length})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('ACCESSORY')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${categoryFilter === 'ACCESSORY'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            Aksesuarlar ({products.filter(p => p.category === 'ACCESSORY').length})
                        </button>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Ürün ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Görsel</th>
                            <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Ürün Adı</th>
                            <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Kategori</th>
                            <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Fiyat</th>
                            <th className="text-left py-4 px-6 text-sm font-bold text-slate-700">Stok</th>
                            <th className="text-right py-4 px-6 text-sm font-bold text-slate-700">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((product) => {
                            const images = JSON.parse(product.images || '[]')
                            const firstImage = images[0]

                            return (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden relative">
                                            {firstImage ? (
                                                <Image src={firstImage} alt={product.name} fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                        <p className="text-sm text-slate-500 line-clamp-1">{product.description}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${product.category === 'PHONE'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {product.category === 'PHONE' ? 'Telefon' : 'Aksesuar'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="font-bold text-slate-900">{Number(product.price).toLocaleString('tr-TR')} ₺</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-slate-700">{product.stock} adet</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-400">
                            {searchQuery || categoryFilter !== 'ALL' ? 'Aramanıza uygun ürün bulunamadı' : 'Henüz ürün eklenmemiş'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Message */}
                            {message.text && (
                                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Product Görselleri</label>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {previewImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group">
                                            <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" unoptimized />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-slate-600"
                                >
                                    <ImageIcon size={20} />
                                    Görsel Seç (Birden fazla seçebilirsiniz)
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Ürün Adı</label>
                                    <input
                                        name="name"
                                        defaultValue={editingProduct?.name}
                                        required
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500/20 outline-none"
                                        placeholder="Örn: iPhone 15 Pro Max"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                                    <select
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500/20 outline-none bg-white"
                                    >
                                        <option value="PHONE">Telefon</option>
                                        <option value="ACCESSORY">Aksesuar</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Fiyat (₺)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        defaultValue={editingProduct?.price}
                                        required
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500/20 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingProduct?.description}
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 ring-blue-500/20 outline-none"
                                    placeholder="Ürün detayları..."
                                />
                            </div>

                            {/* Dynamic Fields */}
                            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-900">
                                    {selectedCategory === 'PHONE' ? 'Telefon Özellikleri' : 'Aksesuar Bilgileri'}
                                </h3>

                                {selectedCategory === 'PHONE' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Hafıza</label>
                                                <input
                                                    name="storage"
                                                    defaultValue={editingProduct?.storage || ''}
                                                    placeholder="Örn: 128GB"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">RAM</label>
                                                <input
                                                    name="ram"
                                                    defaultValue={editingProduct?.ram || ''}
                                                    placeholder="Örn: 8GB"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Durum</label>
                                                <select
                                                    name="condition"
                                                    defaultValue={editingProduct?.condition || 'NEW'}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none bg-white"
                                                >
                                                    <option value="NEW">Sıfır</option>
                                                    <option value="USED">İkinci El</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Pil Sağlığı (%)</label>
                                                <input
                                                    name="batteryHealth"
                                                    defaultValue={editingProduct?.batteryHealth || ''}
                                                    placeholder="Örn: 95"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Garanti Durumu</label>
                                                <select
                                                    name="warranty"
                                                    defaultValue={editingProduct?.condition === 'NEW' ? '2YEAR' : 'STORE'}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none bg-white"
                                                >
                                                    <option value="2YEAR">2 Yıl Garantili</option>
                                                    <option value="1YEAR">1 Yıl Garantili</option>
                                                    <option value="STORE">Mağaza Garantisi</option>
                                                    <option value="NONE">Garantisiz</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Stok Adedi</label>
                                                <input
                                                    name="stock"
                                                    type="number"
                                                    defaultValue={editingProduct?.stock || 1}
                                                    min="0"
                                                    placeholder="Örn: 1"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Alt Kategori</label>
                                                <select
                                                    name="subCategory"
                                                    defaultValue={editingProduct?.subCategory || 'CASE'}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none bg-white"
                                                >
                                                    <option value="CASE">Kılıf / Kapak</option>
                                                    <option value="CHARGER">Şarj Aleti / Kablo</option>
                                                    <option value="SCREEN_PROTECTOR">Ekran Koruyucu</option>
                                                    <option value="HEADPHONE">Kulaklık</option>
                                                    <option value="OTHER">Diğer</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Stok Adedi</label>
                                                <input
                                                    name="stock"
                                                    type="number"
                                                    defaultValue={editingProduct?.stock || 1}
                                                    min="0"
                                                    placeholder="Örn: 50"
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        İşleniyor...
                                    </>
                                ) : (
                                    editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
