"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const form = e.target as HTMLFormElement;
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;

        const email = emailInput.value;
        const password = passwordInput.value;

        // Basit bir admin kontrolü (Demo amaçlı)
        if (email === "admin@gulgonul.com" && password === "123456") {
            // Çerez (Cookie) simülasyonu
            document.cookie = "auth=admin; path=/";
            // Yönlendirme
            window.location.href = "/admin";
        } else {
            setIsLoading(false);
            alert("Hatalı e-posta veya şifre! (Demo için: admin@gulgonul.com / 123456)");
        }
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Hoşgeldiniz</h1>
                        <p className="text-slate-500 text-sm">Hesabınıza giriş yapın</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">E-posta Adresi</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="ornek@email.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Şifre</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/50" />
                                <span className="text-slate-600">Beni hatırla</span>
                            </label>
                            <Link href="#" className="text-primary hover:underline">Şifremi unuttum</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Giriş yapılıyor..." : (
                                <>Giriş Yap <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Hesabınız yok mu?{" "}
                            <Link href="/kayit" className="text-primary font-bold hover:underline">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
