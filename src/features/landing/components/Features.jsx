import { Combine, Fingerprint, MapPinCheckInside, MessageCircle, Settings2 } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">Kenapa pilih TaskHub?</h2>
          <p>
            Platform yang dirancang untuk memudahkan hidupmu. Fitur-fitur lengkap yang membuat
            setiap transaksi aman, cepat, dan terpercaya.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              <h3 className="text-sm font-medium">Chat</h3>
            </div>
            <p className="text-sm">
              Koordinasi mudah dengan chat real-time. Tanya detail, share lokasi, atau update
              progress dalam satu app.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Combine className="size-4" />
              <h3 className="text-sm font-medium">Fleksible Kategori</h3>
            </div>
            <p className="text-sm">
              Food delivery, pickup paket, ketik dokumen, foto produk, dan masih banyak lagi. Semua
              ada!
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="size-4" />

              <h3 className="text-sm font-medium">Keamanan</h3>
            </div>
            <p className="text-sm">Pembayaran Aman.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPinCheckInside className="size-4" />

              <h3 className="text-sm font-medium">Cari Terdekat</h3>
            </div>
            <p className="text-sm">
              Temukan job atau tasker di sekitarmu dalam radius yang kamu mau. Hemat waktu dan
              ongkos!
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />

              <h3 className="text-sm font-medium">Rating & Review</h3>
            </div>
            <p className="text-sm">
              Lihat rating dan review dari user lain sebelum memutuskan. Tasker terbaik dapat badge
              khusus!
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings2 className="size-4" />

              <h3 className="text-sm font-medium">Simple & Cepat</h3>
            </div>
            <p className="text-sm">
              Posting atau lamar pekerjaan dalam hitungan menit, segera mulai
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
