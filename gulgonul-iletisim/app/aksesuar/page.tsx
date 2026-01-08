import { prisma } from '@/lib/prisma'
import AccessoryFeed from './feed'

export const dynamic = 'force-dynamic';

export default async function AccessoriesPage() {
    const accessories = await prisma.product.findMany({
        where: { category: 'ACCESSORY' },
        orderBy: { createdAt: 'desc' }
    })

    // Serialize for client component - convert Decimal to number
    const serializedAccessories = accessories.map(a => ({
        id: a.id,
        name: a.name,
        price: Number(a.price),
        category: a.category,
        subCategory: a.subCategory,
        images: a.images,
        stock: a.stock
    }))

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Aksesuarlar</h1>
                <p className="text-slate-500">Telefonunuz için en kaliteli tamamlayıcılar.</p>
            </div>

            <AccessoryFeed products={serializedAccessories} />
        </div>
    )
}
