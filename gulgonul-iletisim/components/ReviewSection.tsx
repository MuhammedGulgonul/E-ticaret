'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { submitReview } from '@/app/actions'

interface Review {
    id: number
    rating: number
    comment: string | null
    createdAt: Date
    user: {
        name: string | null
    }
}

interface ReviewSectionProps {
    productId: number
    initialReviews: Review[]
    isLoggedIn: boolean
}

export default function ReviewSection({ productId, initialReviews, isLoggedIn }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews)
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0'

    // Rating distribution
    const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
        rating: r,
        count: reviews.filter(rev => rev.rating === r).length
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLoggedIn) {
            setMessage('Değerlendirme yapmak için giriş yapmalısınız.')
            setMessageType('error')
            return
        }

        if (rating === 0) {
            setMessage('Lütfen bir puan seçin.')
            setMessageType('error')
            return
        }

        startTransition(async () => {
            const result = await submitReview(productId, rating, comment)

            if (result.success) {
                setMessage('Değerlendirmeniz başarıyla gönderildi!')
                setMessageType('success')
                setRating(0)
                setComment('')
                // Add new review to list
                if (result.review) {
                    setReviews(prev => [result.review!, ...prev])
                }
            } else {
                setMessage(result.error || 'Bir hata oluştu.')
                setMessageType('error')
            }
        })
    }

    const getInitials = (name: string | null) => {
        if (!name) return '??'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Müşteri Değerlendirmeleri</h2>

            {/* Rating Summary */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 mb-8 shadow-sm">
                <div className="flex items-center gap-8 flex-wrap">
                    <div className="text-center">
                        <p className="text-6xl font-black text-slate-900">{avgRating}</p>
                        <div className="flex gap-1 mt-2 justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    size={20}
                                    className={i <= Math.round(Number(avgRating))
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200"
                                    }
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{reviews.length} değerlendirme</p>
                    </div>
                    <div className="flex-1 space-y-2 min-w-[200px]">
                        {ratingCounts.map(({ rating, count }) => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 w-16">{rating} yıldız</span>
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all"
                                        style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                                <span className="text-sm text-slate-500 w-8">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Form */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Değerlendirme Yazın</h3>

                {message && (
                    <div className={`mb-4 p-4 rounded-xl ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message}
                    </div>
                )}

                {!isLoggedIn && (
                    <div className="mb-4 p-4 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                        Değerlendirme yapmak için <a href="/login" className="font-bold underline">giriş yapın</a>.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Puanınız</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 hover:scale-110 transition-transform"
                                    disabled={!isLoggedIn}
                                >
                                    <Star
                                        size={32}
                                        className={`transition-colors ${star <= (hoverRating || rating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300'
                                            } ${!isLoggedIn ? 'opacity-50' : ''}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Yorumunuz</label>
                        <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={!isLoggedIn}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:opacity-60"
                            placeholder="Ürün hakkında düşüncelerinizi paylaşın..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={!isLoggedIn || isPending}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
                    </button>
                </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-500">
                        Henüz değerlendirme yapılmamış. İlk değerlendirmeyi siz yapın!
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {getInitials(review.user.name)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">{review.user.name || 'Anonim Kullanıcı'}</p>
                                    <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={i <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                        />
                                    ))}
                                </div>
                            </div>
                            {review.comment && (
                                <p className="text-slate-700">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
