'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { hashPassword, verifyPassword } from '@/lib/password'
import { revalidatePath } from 'next/cache'

export async function changePassword(formData: FormData) {
    const session = await getSession()

    if (!session) {
        return { success: false, message: 'Lütfen giriş yapın.' }
    }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, message: 'Lütfen tüm alanları doldurunuz.' }
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: 'Yeni şifreler eşleşmiyor.' }
    }

    if (newPassword.length < 6) {
        return { success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        })

        if (!user) {
            return { success: false, message: 'Kullanıcı bulunamadı.' }
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, user.password)

        if (!isValid) {
            return { success: false, message: 'Mevcut şifre hatalı.' }
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword)

        // Update password
        await prisma.user.update({
            where: { id: session.userId },
            data: { password: hashedNewPassword }
        })

        revalidatePath('/hesap')
        return { success: true, message: 'Şifreniz başarıyla değiştirildi.' }
    } catch (error) {
        console.error('Password change error:', error)
        return { success: false, message: 'Şifre değiştirirken bir hata oluştu.' }
    }
}
