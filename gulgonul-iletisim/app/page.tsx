import Link from "next/link";
import { Smartphone, Wrench, ShieldCheck, Truck } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <InteractiveBackground />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4">

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full text-sm font-medium text-slate-700 mb-8 shadow-lg animate-fade-in-up">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Gülgönül İletişim Online Mağazası Yayında
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-tight animate-fade-in-up animate-delay-100">
            Teknolojiye <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Güvenle</span> Dokunun
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up animate-delay-200">
            En yeni akıllı telefonlar, premium aksesuarlar ve uzman teknik servis hizmeti.
            Teknolojideki güvenilir çözüm ortağınız.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up animate-delay-300">
            <Link href="/telefon" className="group px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 hover:scale-105 active:scale-95">
              <Smartphone size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              Telefonları İncele
            </Link>
            <Link href="/tamir" className="group px-8 py-4 bg-white/80 backdrop-blur-md text-slate-900 border border-slate-200 rounded-full text-lg font-bold hover:bg-white transition-all flex items-center gap-3 hover:scale-105 active:scale-95 hover:shadow-lg">
              <Wrench size={22} className="text-slate-500 group-hover:text-blue-600 group-hover:rotate-45 transition-all duration-300" />
              Tamir Fiyatı Al
            </Link>
          </div>
        </div>
      </section>

      {/* Features Preview - Widgets */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animate-delay-100 cursor-default">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Wrench size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Güvenilir Teknik Servis</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Ekran değişimi, batarya yenileme ve anakart onarımı.
                Uzman teknisyenlerimizle cihazınız emin ellerde.
              </p>
            </div>

            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animate-delay-200 cursor-default">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Garantili Satış</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Sattığımız tüm sıfır ve ikinci el cihazlar firmamızın güvencesi altındadır.
                Sorunsuz alışveriş deneyimi.
              </p>
            </div>

            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animate-delay-300 cursor-default">
              <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-cyan-600 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">Hızlı Aksesuar</h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Kılıf, şarj aleti, kulaklık ve daha fazlası.
                En kaliteli ürünlere mağazamızdan veya online ulaşın.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
