import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import AdminLayoutClient from './layout-client'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    // Check if user is logged in and is admin
    if (!session || session.role !== 'ADMIN') {
        redirect('/login')
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>
}
