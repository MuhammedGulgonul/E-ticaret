import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
    try {
        const { id, status } = await request.json()

        await prisma.repairRequest.update({
            where: { id },
            data: { status }
        })

        revalidatePath('/admin/tamir')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Update status error:', error)
        return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 })
    }
}
