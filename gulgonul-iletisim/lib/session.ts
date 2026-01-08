import { cookies } from 'next/headers'

export interface Session {
    userId: number
    email: string
    name: string
    role: string
}

export async function createSession(user: Session) {
    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    })
}

export async function getSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies()
        const session = cookieStore.get('session')
        if (!session) return null
        return JSON.parse(session.value)
    } catch {
        return null
    }
}

export async function clearSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}
