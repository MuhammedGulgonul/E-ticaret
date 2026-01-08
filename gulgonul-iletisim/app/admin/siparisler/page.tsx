import { prisma } from '@/lib/prisma'
import { Package } from 'lucide-react'
import OrdersList from '@/components/OrdersList'

export const dynamic = 'force-dynamic';

export default async function OrdersManagementPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            },
            items: {
                include: {
                    product: {
                        select: { id: true, name: true, images: true }
                    }
                }
            }
        }
    });

    // Serialize for client component
    const serializedOrders = orders.map(order => ({
        ...order,
        totalAmount: order.totalAmount.toString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map(item => ({
            ...item,
            price: item.price.toString()
        }))
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Siparişler</h1>
                    <p className="text-slate-500">{orders.length} adet sipariş</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">Henüz sipariş bulunmuyor</p>
                </div>
            ) : (
                <OrdersList orders={serializedOrders} />
            )}
        </div>
    )
}
