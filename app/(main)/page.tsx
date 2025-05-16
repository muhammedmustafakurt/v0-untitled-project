import { AutoRentNumber } from "@/components/auto-rent-number"
import { ShoppingBagIcon, CheckCircleIcon, ShieldCheckIcon, ClockIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-red-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Yemeksepeti için Doğrulama Numarası</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Yemeksepeti hesabınızı doğrulamak için hızlı ve güvenli bir şekilde geçici telefon numarası alın.
          </p>

          <div className="max-w-md mx-auto">
            <AutoRentNumber />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Numaranızı Alın</h3>
              <p className="text-gray-600">Butona tıklayın ve size hemen bir telefon numarası atayalım.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Yemeksepeti'nde Kullanın</h3>
              <p className="text-gray-600">Numarayı Yemeksepeti kayıt formunda kullanın.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">SMS'leri Alın</h3>
              <p className="text-gray-600">Doğrulama kodlarını ve mesajları platformumuzda görüntüleyin.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Neden Bizi Seçmelisiniz?</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <span>Gizliliğinizi koruyun - kişisel numaranızı paylaşmayın</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <span>Anında erişim - seçim yapmanıza gerek yok</span>
                </li>
                <li className="flex items-start gap-2">
                  <ClockIcon className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <span>Hızlı ve kolay - sadece bir tıklama ile numara alın</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShoppingBagIcon className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <span>Yemeksepeti ve diğer yemek siparişi uygulamaları için idealdir</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Yemek siparişi uygulaması doğrulama"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
