const features = [
  "Catat tontonan lengkap dengan poster, tipe, genre, studio, tanggal tayang, dan sinopsis.",
  "Kelompokkan tontonan berdasarkan kategori: Anime, Donghua, Film Movie, dan Drama China.",
  "Kelola banyak season, masing-masing dengan poster dan sinopsis sendiri.",
  "Simpan daftar episode beserta thumbnail, tautan nonton, dan catatan.",
  "Pantau progress menonton lewat persentase dan penanda sudah ditonton.",
  "Cari tontonan berdasarkan judul dan tandai favorit dengan bintang.",
];

const techs = ["React", "TypeScript", "Tailwind CSS", "Vite", "localStorage"];

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-blue-200 bg-white/80 p-6 backdrop-blur sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Tentang MyWatch</h1>

        <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          MyWatch adalah aplikasi watchlist pribadi untuk mencatat apa yang
          ingin, sedang, dan sudah Anda tonton: anime, donghua, film, hingga
          drama China. Semua tontonan, season, dan episode bisa dicatat dalam
          satu tempat, lengkap dengan tautan tempat menontonnya.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          Aplikasi ini dibuat sebagai proyek belajar React. Tidak ada backend,
          database, ataupun API: seluruh logika berjalan di browser memakai
          state dan array, dan datanya disimpan di localStorage agar tetap ada
          setelah halaman di-refresh.
        </p>

        <h2 className="mt-8 text-lg font-bold text-gray-900">Fitur Utama</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm leading-relaxed text-gray-700 sm:text-base">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 text-lg font-bold text-gray-900">Dibangun Dengan</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {techs.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-700">
            Catatan tentang data
          </p>
          <p className="mt-1 text-sm leading-relaxed text-indigo-900/80">
            Seluruh data disimpan di browser perangkat ini (localStorage), bukan
            di server. Jika data situs di browser dihapus, atau Anda membuka
            MyWatch di perangkat atau browser lain, daftar tontonan tidak akan
            terlihat.
          </p>
        </div>
      </div>
    </main>
  );
}