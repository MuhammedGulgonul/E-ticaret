'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { iyzipay } from '@/lib/iyzico'
import Iyzipay from 'iyzipay'
import { redirect } from 'next/navigation'

export async function createPayment() {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    try {
        // Sepeti al
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

        // Toplam tutarı hesapla
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (Number(item.product.price) * item.quantity)
        }, 0)

        // Kullanıcı bilgilerini al
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        })

        if (!user) {
            return { success: false, message: 'Kullanıcı bulunamadı.' }
        }

        // İyzico için ödeme talebi oluştur
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: `order_${Date.now()}`,
            price: totalAmount.toFixed(2),
            paidPrice: totalAmount.toFixed(2),
            currency: Iyzipay.CURRENCY.TRY,
            basketId: cart.id.toString(),
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/odeme/callback`,
            enabledInstallments: [1, 2, 3, 6, 9], // Taksit seçenekleri
            buyer: {
                id: user.id.toString(),
                name: user.name?.split(' ')[0] || 'Ad',
                surname: user.name?.split(' ').slice(1).join(' ') || 'Soyad',
                email: user.email,
                identityNumber: '11111111111', // Gerçek uygulamada kullanıcıdan alınmalı
                registrationAddress: 'Adres bilgisi', // Gerçek uygulamada kullanıcıdan alınmalı
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34000'
            },
            shippingAddress: {
                contactName: user.name || 'Ad Soyad',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Teslimat adresi', // Gerçek uygulamada kullanıcıdan alınmalı
                zipCode: '34000'
            },
            billingAddress: {
                contactName: user.name || 'Ad Soyad',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Fatura adresi', // Gerçek uygulamada kullanıcıdan alınmalı
                zipCode: '34000'
            },
            basketItems: cart.items.map(item => ({
                id: item.product.id.toString(),
                name: item.product.name,
                category1: item.product.category,
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: (Number(item.product.price) * item.quantity).toFixed(2)
            }))
        }

        // İyzico checkout form oluştur (kredi kartı bilgileri İyzico'da kalır)
        return new Promise((resolve, reject) => {
            iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
                if (err) {
                    console.error('İyzico error:', err)
                    resolve({ success: false, message: 'Ödeme başlatılamadı.' })
                    return
                }

                if (result.status === 'success') {
                    // Ödeme formunun HTML içeriğini döndür
                    resolve({
                        success: true,
                        paymentPageUrl: result.paymentPageUrl,
                        token: result.token
                    })
                } else {
                    resolve({
                        success: false,
                        message: result.errorMessage || 'Ödeme başlatılamadı.'
                    })
                }
            })
        })
    } catch (error) {
        console.error('Payment creation error:', error)
        return { success: false, message: 'Ödeme oluşturulurken hata oluştu.' }
    }
}

export async function handlePaymentCallback(token: string) {
    try {
        const request = {
            locale: Iyzipay.LOCALE.TR,
            token: token
        }

        return new Promise((resolve, reject) => {
            iyzipay.checkoutForm.retrieve(request, async (err: any, result: any) => {
                if (err) {
                    console.error('İyzico callback error:', err)
                    resolve({ success: false, message: 'Ödeme doğrulanamadı.' })
                    return
                }

                if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                    // Ödeme başarılı - sipariş oluştur
                    const session = await getSession()

                    if (session) {
                        // Sepeti temizle
                        await prisma.cartItem.deleteMany({
                            where: {
                                cart: {
                                    userId: session.userId
                                }
                            }
                        })

                        // TODO: Sipariş kaydı oluştur
                        // await prisma.order.create(...)
                    }

                    resolve({
                        success: true,
                        message: 'Ödeme başarılı!',
                        paymentId: result.paymentId
                    })
                } else {
                    resolve({
                        success: false,
                        message: result.errorMessage || 'Ödeme başarısız.'
                    })
                }
            })
        })
    } catch (error) {
        console.error('Callback handling error:', error)
        return { success: false, message: 'Ödeme doğrulanamadı.' }
    }
}
