import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getSession()

    if (!session) {
        return NextResponse.json({ count: 0 })
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: session.userId },
        include: {
            items: true
        }
    })

    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    return NextResponse.json({ count })
}
