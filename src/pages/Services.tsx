import type { ReactNode } from "react";

type Service = {
  title: string;
  description: string;
  icon: ReactNode; // isi gambar ikon (bentuk-bentuk di dalam <svg>)
};

const services: Service[] = [
  {
    title: "Watchlist Pribadi",
    description:
      "Catat anime, donghua, film, dan drama China yang ingin atau sedang Anda tonton dalam satu tempat.",
    icon: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  },
  {
    title: "Pelacak Episode",
    description:
      "Simpan nomor, judul, thumbnail, dan catatan tiap episode, lalu tandai mana yang sudah ditonton.",
    icon: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
  },
  {
    title: "Manajemen Season",
    description:
      "Satu judul bisa punya banyak season, masing-masing dengan poster, sinopsis, dan daftar episode sendiri.",
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </>
    ),
  },
  {
    title: "Pantau Progress",
    description:
      "Lihat persentase tontonan per season maupun per judul, lengkap dengan status Plan to watch, Watching, dan Completed.",
    icon: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </>
    ),
  },
  {
    title: "Pencarian & Kategori",
    description:
      "Cari tontonan berdasarkan judul, dan lihat daftar yang sudah dikelompokkan per kategori di halaman utama.",
    icon: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  {
    title: "Tautan Nonton",
    description:
      "Simpan link YouTube, Netflix, atau platform lain di setiap episode dan buka langsung dengan satu klik.",
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
  },
];

export default function Services() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-blue-200 bg-white/80 p-6 backdrop-blur sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Layanan</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          Berikut yang bisa Anda lakukan dengan MyWatch untuk mengatur tontonan
          favorit Anda.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-300"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  {service.icon}
                </svg>
              </span>
              <h2 className="mt-3 text-base font-semibold text-gray-900">
                {service.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}