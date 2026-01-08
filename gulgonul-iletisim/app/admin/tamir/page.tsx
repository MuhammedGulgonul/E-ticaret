import { prisma } from '@/lib/prisma'
import RepairManagementClient from './client'

export const dynamic = 'force-dynamic';

export default async function RepairManagementPage() {
    const repairs = await prisma.repairRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    // Serialize to avoid Decimal issues
    const serializedRepairs = repairs.map(r => ({
        ...r,
        quote: r.quote ? Number(r.quote) : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString()
    }))

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Tamir Talepleri</h1>
            </div>
            <RepairManagementClient repairs={serializedRepairs} />
        </div>
    )
}
