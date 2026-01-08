'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: number, quantity: number = 1) {
    const session = await getSession()
    if (!session) {
        return { success: false, message: 'Lütfen önce giriş yapın.' }
    }

    try {
        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: session.userId }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: session.userId }
            })
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        })

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            })
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            })
        }

        revalidatePath('/sepet')
        return { success: true, message: 'Ürün sepete eklendi!' }
    } catch (error) {
        console.error('Add to cart error:', error)
        return { success: false, message: 'Sepete eklenirken bir hata oluştu.' }
    }
}

export async function removeFromCart(cartItemId: number) {
    try {
        await prisma.cartItem.delete({
            where: { id: cartItemId }
        })

        revalidatePath('/sepet')
        return { success: true, message: 'Ürün sepetten kaldırıldı.' }
    } catch (error) {
        console.error('Remove from cart error:', error)
        return { success: false, message: 'Ürün kaldırılırken hata oluştu.' }
    }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
    try {
        if (quantity <= 0) {
            return removeFromCart(cartItemId)
        }

        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        })

        revalidatePath('/sepet')
        return { success: true }
    } catch (error) {
        console.error('Update quantity error:', error)
        return { success: false, message: 'Miktar güncellenirken hata oluştu.' }
    }
}

export async function clearCart(userId: number) {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId }
        })

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            })
        }

        revalidatePath('/sepet')
        return { success: true, message: 'Sepet temizlendi.' }
    } catch (error) {
        console.error('Clear cart error:', error)
        return { success: false, message: 'Sepet temizlenirken hata oluştu.' }
    }
}
