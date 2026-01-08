'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
    const session = await getSession()

    if (!session) {
        return { success: false, message: 'Lütfen giriş yapın.' }
    }

    const shippingAddress = formData.get('shippingAddress') as string
    const phone = formData.get('phone') as string
    const notes = formData.get('notes') as string || ''

    if (!shippingAddress || !phone) {
        return { success: false, message: 'Lütfen tüm zorunlu alanları doldurun.' }
    }

    try {
        // Get cart
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

        if (!cart || cart.items.length === 0) {
            return { success: false, message: 'Sepetiniz boş.' }
        }

        // Calculate total
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity)
        }, 0)

        // Generate order number
        const orderNumber = `ORD-${Date.now()}`

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: session.userId,
                totalAmount,
                shippingAddress,
                phone,
                email: session.email,
                notes,
                paymentMethod: 'CASH_ON_DELIVERY',
                paymentStatus: 'PENDING',
                status: 'PENDING',
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            }
        })

        // Decrease stock for each product
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        revalidatePath('/sepet')
        return {
            success: true,
            message: 'Siparişiniz alındı!',
            orderNumber: order.orderNumber
        }
    } catch (error) {
        console.error('Order creation error:', error)
        return { success: false, message: 'Sipariş oluşturulurken hata oluştu.' }
    }
}
