'use client'

import { useState } from 'react'
import { Package, Clock, Truck, CheckCircle, XCircle, User, MapPin, Phone, ChevronDown, ChevronRight } from 'lucide-react'

interface OrderItem {
    id: number
    quantity: number
    price: string | number
    product: {
        id: number
        name: string
        images: string
    }
}

interface Order {
    id: number
    orderNumber: string
    status: string
    totalAmount: string | number
    paymentMethod: string
    shippingAddress: string
    phone: string
    email: string
    notes: string | null
    createdAt: string
    user: {
        id: number
        name: string | null
        email: string
    }
    items: OrderItem[]
}

interface OrdersListProps {
    orders: Order[]
}

const statusMap: Record<string, { label: string, color: string, bgColor: string, icon: any }> = {
    'PENDING': { label: 'Beklemede', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    'PROCESSING': { label: 'Hazırlanıyor', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Package },
    'SHIPPED': { label: 'Kargoda', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: Truck },
    'DELIVERED': { label: 'Teslim Edildi', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
    'CANCELLED': { label: 'İptal', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
}

export default function OrdersList({ orders }: OrdersListProps) {
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())

    const toggleOrder = (orderId: number) => {
        setExpandedOrders(prev => {
            const next = new Set(prev)
            if (next.has(orderId)) {
                next.delete(orderId)
            } else {
                next.add(orderId)
            }
            return next
        })
    }

    return (
        <div className="space-y-2">
            {orders.map(order => {
                const StatusInfo = statusMap[order.status] || statusMap['PENDING']
                const StatusIcon = StatusInfo.icon
                const isExpanded = expandedOrders.has(order.id)

                return (
                    <div key={order.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                        {/* Collapsed Row - Always Visible */}
                        <div
                            onClick={() => toggleOrder(order.id)}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {/* Expand Icon */}
                                <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                                    {isExpanded ? (
                                        <ChevronDown size={20} className="text-slate-400" />
                                    ) : (
                                        <ChevronRight size={20} className="text-slate-400" />
                                    )}
                                </button>

                                {/* Order Number */}
                                <span className="font-bold text-slate-900 min-w-[100px]">
                                    #{order.orderNumber}
                                </span>

                                {/* Status */}
                                <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${StatusInfo.bgColor} ${StatusInfo.color}`}>
                                    <StatusIcon size={12} />
                                    {StatusInfo.label}
                                </span>

                                {/* Customer */}
                                <span className="text-sm text-slate-600 hidden md:block">
                                    {order.user.name || 'İsimsiz'}
                                </span>

                                {/* Date */}
                                <span className="text-xs text-slate-400 hidden lg:block">
                                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                </span>

                                {/* Items Count */}
                                <span className="text-xs text-slate-400 hidden sm:block">
                                    {order.items.length} ürün
                                </span>
                            </div>

                            {/* Total */}
                            <span className="font-black text-blue-600">
                                {Number(order.totalAmount).toLocaleString('tr-TR')} ₺
                            </span>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                            <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                                {/* Customer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white rounded-xl border border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <User className="text-slate-400 mt-1" size={18} />
                                        <div>
                                            <p className="text-xs text-slate-500">Müşteri</p>
                                            <p className="font-medium text-slate-800">{order.user.name || 'İsimsiz'}</p>
                                            <p className="text-xs text-slate-500">{order.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="text-slate-400 mt-1" size={18} />
                                        <div>
                                            <p className="text-xs text-slate-500">Telefon</p>
                                            <p className="font-medium text-slate-800">{order.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-slate-400 mt-1" size={18} />
                                        <div>
                                            <p className="text-xs text-slate-500">Adres</p>
                                            <p className="font-medium text-slate-800 text-sm">{order.shippingAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <p className="text-sm font-bold text-slate-700 mb-3">Ürünler ({order.items.length})</p>
                                    <div className="space-y-2">
                                        {order.items.map(item => (
                                            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                        <Package size={18} className="text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">{item.product.name}</p>
                                                        <p className="text-xs text-slate-500">x{item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-bold text-slate-800">
                                                    {(Number(item.price) * item.quantity).toLocaleString('tr-TR')} ₺
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                {order.notes && (
                                    <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <p className="text-xs font-bold text-yellow-700 mb-1">Müşteri Notu:</p>
                                        <p className="text-sm text-yellow-800">{order.notes}</p>
                                    </div>
                                )}

                                {/* Status Update */}
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <p className="text-xs text-slate-500">
                                        Ödeme: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Kapıda Ödeme' : 'Kredi Kartı'}
                                    </p>
                                    <form action={`/api/order/update-status`} method="POST" className="flex items-center gap-3">
                                        <input type="hidden" name="orderId" value={order.id} />
                                        <select
                                            name="status"
                                            defaultValue={order.status}
                                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        >
                                            <option value="PENDING">Beklemede</option>
                                            <option value="PROCESSING">Hazırlanıyor</option>
                                            <option value="SHIPPED">Kargoda</option>
                                            <option value="DELIVERED">Teslim Edildi</option>
                                            <option value="CANCELLED">İptal</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Güncelle
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
