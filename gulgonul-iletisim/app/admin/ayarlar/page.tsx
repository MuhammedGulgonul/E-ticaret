'use client'

import { Settings, Store, Phone, Globe, MapPin, Save, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Form state
    const [settings, setSettings] = useState({
        storeName: 'Gülgönül İletişim',
        whatsappNumber: '905555555555',
        address: 'İstanbul, Türkiye',
        siteTitle: 'Gülgönül İletişim - Telefon & Aksesuar',
        siteDescription: 'En kaliteli telefonlar ve aksesuarlar için doğru adres.',
        maintenanceMode: false
    })

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('siteSettings')
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }, [])

    async function handleSave() {
        setLoading(true)
        setMessage(null)

        // Save to localStorage
        localStorage.setItem('siteSettings', JSON.stringify(settings))

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setLoading(false)
        setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' })

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Ayarlar</h1>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mağaza Bilgileri */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Store className="text-blue-600" size={24} />
                        <h2 className="text-lg font-bold text-slate-800">Mağaza Bilgileri</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mağaza Adı</label>
                            <input
                                type="text"
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                <Phone size={14} className="inline mr-1" /> WhatsApp Numarası
                            </label>
                            <input
                                type="tel"
                                value={settings.whatsappNumber}
                                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                <MapPin size={14} className="inline mr-1" /> Adres
                            </label>
                            <textarea
                                rows={3}
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Site Ayarları */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Globe className="text-purple-600" size={24} />
                        <h2 className="text-lg font-bold text-slate-800">Site Ayarları</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Site Başlığı</label>
                            <input
                                type="text"
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Site Açıklaması</label>
                            <textarea
                                rows={3}
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="maintenance"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                className="w-5 h-5 rounded border-slate-300"
                            />
                            <label htmlFor="maintenance" className="text-sm font-medium text-slate-700">
                                Bakım Modu (Site geçici olarak kapalı)
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
