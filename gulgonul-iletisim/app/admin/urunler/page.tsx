import { prisma } from '@/lib/prisma';
import ProductManagementClient from './client';

export const dynamic = 'force-dynamic';

export default async function ProductManagementPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Serialize Decimal to number for client component
    const serializedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        subCategory: p.subCategory,
        images: p.images,
        stock: p.stock,
        condition: p.condition,
        storage: p.storage,
        ram: p.ram,
        batteryHealth: p.batteryHealth
    }))

    return <ProductManagementClient products={serializedProducts} />;
}
