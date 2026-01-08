'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Check, Loader2 } from 'lucide-react'
import { addToCart } from '@/app/cart-actions'

interface AddToCartButtonProps {
    productId: number
    className?: string
}

export default function AddToCartButton({ productId, className }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)

    const handleClick = () => {
        startTransition(async () => {
            const result = await addToCart(productId, 1)
            if (result.success) {
                setIsSuccess(true)
                setTimeout(() => {
                    setIsSuccess(false)
                    window.location.reload() // Refresh to update cart count
                }, 1000)
            } else {
                alert('❌ ' + result.message)
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={className || "flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70"}
        >
            {isPending ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    Ekleniyor...
                </>
            ) : isSuccess ? (
                <>
                    <Check size={20} />
                    Eklendi!
                </>
            ) : (
                <>
                    <ShoppingBag size={20} />
                    Sepete Ekle
                </>
            )}
        </button>
    )
}
