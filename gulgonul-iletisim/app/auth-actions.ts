'use server'

import { prisma } from '@/lib/prisma'
import { createSession, clearSession } from '@/lib/session'
import { verifyPassword } from '@/lib/password'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, message: 'Lütfen tüm alanları doldurunuz.' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return { success: false, message: 'E-posta veya şifre hatalı.' }
        }

        // Verify password with bcrypt
        const isValidPassword = await verifyPassword(password, user.password)

        if (!isValidPassword) {
            return { success: false, message: 'E-posta veya şifre hatalı.' }
        }

        // Create session
        await createSession({
            userId: user.id,
            email: user.email,
            name: user.name || 'Kullanıcı',
            role: user.role
        })

        // Redirect based on role
        if (user.role === 'ADMIN') {
            redirect('/admin')
        } else {
            redirect('/')
        }
    } catch (error: any) {
        if (error?.message?.includes('NEXT_REDIRECT')) {
            throw error
        }
        console.error('Login error:', error)
        return { success: false, message: 'Giriş yapılırken bir hata oluştu.' }
    }
}

export async function logoutUser() {
    'use server'
    await clearSession()
    revalidatePath('/', 'layout')
    redirect('/login')
}
