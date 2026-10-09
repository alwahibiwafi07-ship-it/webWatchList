import { useRef, useState } from "react";
import MainNavbar from "../components/navbarMain";
import { SHOW_TYPES, STATUS_FILTERS, type StatusFilter } from "../types";
import type { ShowDetail } from "./Detail";

type HomeProps = {
  shows: ShowDetail[];
  onAddClick: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

// Hitung jumlah episode dan progress dari seluruh season
function getStats(show: ShowDetail) {
  const episodes = show.seasons.flatMap((s) => s.episodes);
  const watched = episodes.filter((e) => e.watched).length;
  const progress = episodes.length
    ? Math.round((watched / episodes.length) * 100)
    : 0;
  return { total: episodes.length, watched, progress };
}

// Apakah tontonan ini cocok dengan filter status yang dipilih?
function matchesFilter(show: ShowDetail, filter: StatusFilter) {
  if (filter === "all") return true;

  const { total, watched } = getStats(show);
  if (filter === "completed") return total > 0 && watched === total;
  return watched > 0 && watched < total; // "watching"
}

type ShowRowProps = {
  title: string;
  shows: ShowDetail[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

// Satu baris kategori: judul + tombol panah + kartu yang bisa digeser
function ShowRow({ title, shows, onOpen, onDelete }: ShowRowProps) {
  const rowRef = useRef<HTMLUListElement>(null);

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={scrollRight}
          aria-label={`Geser daftar ${title}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <ul ref={rowRef} className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {shows.map((show) => {
          const { total, watched, progress } = getStats(show);

          return (
            <li key={show.id} className="group relative w-36 shrink-0 sm:w-44">
              {/* Kartu (klik untuk membuka detail) */}
              <button
                type="button"
                onClick={() => onOpen(show.id)}
                className="block w-full text-left"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                  {show.poster ? (
                    <img
                      src={show.poster}
                      alt={show.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <svg
                        className="h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.16-5.16a2.25 2.25 0 013.18 0l5.16 5.16m-1.5-1.5l1.41-1.41a2.25 2.25 0 013.18 0l2.25 2.25M3.75 21h16.5a1.5 1.5 0 001.5-1.5V4.5a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v15a1.5 1.5 0 001.5 1.5zM14.25 8.25h.008v.008h-.008V8.25z"
                        />
                      </svg>
                    </div>
                  )}

                  {show.favorite && (
                    <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs font-medium text-indigo-600">
                  {show.genres?.[0] ?? show.type}
                </p>
                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                  {show.title}
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  {total === 0
                    ? "Belum ada episode"
                    : `${watched} / ${total} episodes`}
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>

              {/* Tombol hapus (di luar tombol kartu agar tidak bersarang) */}
              <button
                type="button"
                aria-label={`Hapus ${show.title}`}
                onClick={() => {
                  if (window.confirm(`Hapus "${show.title}" dari watchlist?`)) {
                    onDelete(show.id);
                  }
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-opacity hover:bg-red-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Home({ shows, onAddClick, onOpen, onDelete }: HomeProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const keyword = search.trim().toLowerCase();
  const filtered = shows.filter(
    (show) =>
      show.title.toLowerCase().includes(keyword) && matchesFilter(show, filter)
  );

  const filterLabel =
    STATUS_FILTERS.find((item) => item.value === filter)?.label ?? "";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <MainNavbar
        search={search}
        onSearchChange={setSearch}
        onAddClick={onAddClick}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">My Watchlist</h1>

        {/* Label filter aktif (klik untuk menghapus filter) */}
        {filter !== "all" && (
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-label={`Hapus filter ${filterLabel}`}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            {filterLabel}
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        /* Tampilan saat daftar kosong / hasil pencarian atau filter kosong */
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-16 text-center">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.375 19.5h17.25M3.375 4.5h17.25M3.375 4.5v15m17.25-15v15M7.5 4.5v15m9-15v15M3.375 12h17.25"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {shows.length === 0 ? "Watchlist masih kosong" : "Tidak ditemukan"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {shows.length === 0
              ? "Tambahkan film atau serial pertama Anda untuk mulai melacak tontonan."
              : "Coba kata kunci atau filter lain untuk mencari tontonan Anda."}
          </p>
        </div>
      ) : (
        /* Satu baris per kategori; kategori tanpa isi tidak ditampilkan */
        SHOW_TYPES.map((type) => {
          const list = filtered.filter((show) => show.type === type);
          if (list.length === 0) return null;

          return (
            <ShowRow
              key={type}
              title={type}
              shows={list}
              onOpen={onOpen}
              onDelete={onDelete}
            />
          );
        })
      )}
    </main>
  );
}