'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react'

interface ImageSliderProps {
    images: string[]
    productName: string
    condition: string
}

export default function ImageSlider({ images, productName, condition }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const hasImages = images && images.length > 0
    const hasMultipleImages = images && images.length > 1

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-slate-100 rounded-3xl overflow-hidden aspect-[4/3] relative group">
                {hasImages ? (
                    <Image
                        src={images[currentIndex]}
                        alt={`${productName} - Görsel ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Smartphone className="w-32 h-32 text-slate-300" />
                    </div>
                )}

                {/* Badge */}
                <div className="absolute top-6 left-6 z-10">
                    <span className={`px-4 py-2 text-sm font-bold rounded-full border shadow-lg backdrop-blur-sm ${condition === 'NEW'
                            ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50/90 text-amber-600 border-amber-100'
                        }`}>
                        {condition === 'NEW' ? 'SIFIR' : 'İKİNCİ EL'}
                    </span>
                </div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Önceki görsel"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Sonraki görsel"
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${index === currentIndex
                                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                                    : 'border-transparent hover:border-slate-300'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${productName} - Küçük görsel ${index + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
