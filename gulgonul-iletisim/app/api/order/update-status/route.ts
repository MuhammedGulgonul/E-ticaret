import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const orderId = parseInt(formData.get('orderId') as string)
        const status = formData.get('status') as string

        if (!orderId || !status) {
            return NextResponse.redirect(new URL('/admin/siparisler?error=missing', request.url))
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        revalidatePath('/admin/siparisler')

        return NextResponse.redirect(new URL('/admin/siparisler?success=updated', request.url))
    } catch (error) {
        console.error('Order status update error:', error)
        return NextResponse.redirect(new URL('/admin/siparisler?error=failed', request.url))
    }
}
