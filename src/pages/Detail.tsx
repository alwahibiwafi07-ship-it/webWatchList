import { useState } from "react";
import type { ShowFormat, ShowType } from "../types";

export type Episode = {
  id: string;
  number: number;
  title: string;
  link: string; // tautan nonton
  platform: string; // contoh: "YouTube" (dibuat otomatis dari link)
  watched: boolean;
  thumbnail?: string;
  notes?: string;
};

export type Season = {
  id: string;
  name: string; // judul season, contoh: "Season 2"
  poster?: string;
  description?: string;
  episodes: Episode[];
};

export type ShowDetail = {
  id: string;
  title: string;
  type: ShowType; // kategori (Anime, Donghua, ...): untuk pengelompokan di Home
  format?: ShowFormat; // jenis tontonan (TV Series, Movie, OVA, ...): tampil sebagai "Tipe"
  airedStart?: string; // contoh: "2006-02-10"
  studios?: string; // contoh: "Madhouse, Satelight"
  genres?: string[];
  description: string; // sinopsis
  poster: string;
  favorite: boolean;
  seasons: Season[];
};

type DetailProps = {
  show: ShowDetail;
  focusSeasonId?: string; // jika diisi: tampil sebagai halaman detail satu season
  onBack: () => void;
  onAddEpisode: (seasonId: string) => void;
  onEditEpisode: (seasonId: string, episodeId: string) => void;
  onDeleteEpisode: (seasonId: string, episodeId: string) => void;
  onOpenSeason?: (seasonId: string) => void;
  onAddSeason?: () => void;
  onDeleteSeason?: (seasonId: string) => void;
  onEdit?: () => void;
  onToggleFavorite?: () => void;
  onToggleWatched?: (seasonId: string, episodeId: string) => void;
};

type Tab = "info" | "episode" | "season";

const tabs: { key: Tab; label: string }[] = [
  { key: "info", label: "Info" },
  { key: "episode", label: "Episode" },
  { key: "season", label: "Season" },
];

const heroButton =
  "flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50";

// Satu baris informasi di tab Info: label kecil abu-abu + nilainya
function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}

export default function Detail({
  show,
  focusSeasonId,
  onBack,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onOpenSeason,
  onAddSeason,
  onDeleteSeason,
  onEdit,
  onToggleFavorite,
  onToggleWatched,
}: DetailProps) {
  const isSeasonMode = focusSeasonId !== undefined;
  const visibleTabs = isSeasonMode
    ? tabs.filter((t) => t.key !== "season")
    : tabs;

  const [tab, setTab] = useState<Tab>("episode");
  const [seasonId, setSeasonId] = useState(show.seasons[0]?.id ?? "");
  const [menuId, setMenuId] = useState<string | null>(null); // episode yang menunya terbuka

  // Season yang sedang ditampilkan (mode season: season yang diklik)
  const season =
    show.seasons.find((s) => s.id === (focusSeasonId ?? seasonId)) ??
    show.seasons[0];
  const episodes = season?.episodes ?? [];
  const watchedCount = episodes.filter((e) => e.watched).length;
  const progress = episodes.length
    ? Math.round((watchedCount / episodes.length) * 100)
    : 0;

  // Cakupan banner: satu season (mode season) atau seluruh anime
  const allEpisodes = show.seasons.flatMap((s) => s.episodes);
  const scopeEpisodes = isSeasonMode ? episodes : allEpisodes;
  const totalWatched = scopeEpisodes.filter((e) => e.watched).length;
  const nextEpisode = scopeEpisodes.find((e) => !e.watched);

  const status =
    scopeEpisodes.length > 0 && totalWatched === scopeEpisodes.length
      ? "Completed"
      : totalWatched > 0
      ? "Watching"
      : "Plan to watch";

  // Data banner & info: season punya poster/deskripsi sendiri, kalau kosong pakai milik anime
  const heroPoster = (isSeasonMode ? season?.poster : "") || show.poster;
  const heroTitle = isSeasonMode && season ? season.name : show.title;
  const description =
    (isSeasonMode ? season?.description : "") || show.description;

  const handlePlay = () => {
    if (nextEpisode?.link) {
      window.open(nextEpisode.link, "_blank", "noopener,noreferrer");
    }
  };

  const handleEditEpisode = (ep: Episode) => {
    setMenuId(null);
    if (season) onEditEpisode(season.id, ep.id);
  };

  const handleDeleteEpisode = (ep: Episode) => {
    setMenuId(null);
    if (season && window.confirm(`Hapus episode ${ep.number} "${ep.title}"?`)) {
      onDeleteEpisode(season.id, ep.id);
    }
  };

  const handleDeleteSeason = (s: Season) => {
    const count = s.episodes.length;
    const message =
      count > 0
        ? `Hapus "${s.name}" beserta ${count} episode di dalamnya?`
        : `Hapus "${s.name}"?`;

    if (window.confirm(message)) {
      onDeleteSeason?.(s.id);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-lg border border-blue-200 bg-white">
        {/* ===== Banner ===== */}
        <div className="relative h-72 overflow-hidden rounded-t-lg bg-gradient-to-br from-indigo-500 to-indigo-800 sm:h-80">
          {heroPoster && (
            <img
              src={heroPoster}
              alt={heroTitle}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

          <div className="relative flex h-full flex-col justify-between p-4">
            {/* Baris atas: kembali, pil status, aksi */}
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className={heroButton}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-white/30 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                  {status}
                </span>
                <span className="rounded-full bg-indigo-600/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                  {show.format ?? show.type}
                </span>
              </div>

              {/* Bintang & pensil hanya untuk halaman anime, bukan season */}
              {isSeasonMode ? (
                <div className="h-9 w-9" aria-hidden="true" />
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleFavorite}
                    aria-label="Toggle favorite"
                    aria-pressed={show.favorite}
                    className={heroButton}
                  >
                    <svg
                      className={`h-5 w-5 ${show.favorite ? "text-yellow-400" : "text-white"}`}
                      fill={show.favorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={onEdit}
                    aria-label="Edit"
                    className={heroButton}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Baris bawah: judul, statistik, tombol play */}
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                {isSeasonMode && (
                  <p className="truncate text-sm font-medium text-white/80">
                    {show.title}
                  </p>
                )}
                <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">
                  {heroTitle}
                </h1>
                <p className="mt-1 flex flex-wrap gap-x-4 text-sm font-medium">
                  <span className="text-rose-400">
                    {scopeEpisodes.length} episodes
                  </span>
                  <span className="text-amber-300">
                    {isSeasonMode
                      ? `${totalWatched} watched`
                      : `${show.seasons.length} seasons`}
                  </span>
                </p>
              </div>

              {nextEpisode && (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={`Play episode ${nextEpisode.number}`}
                  className="flex shrink-0 flex-col items-center gap-1 text-white"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white transition-colors hover:bg-white/20">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="text-sm">ep {nextEpisode.number}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== Tab ===== */}
        <div
          role="tablist"
          className={`grid border-b border-blue-200 bg-slate-100 px-4 sm:px-6 ${
            visibleTabs.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {visibleTabs.map((t, i) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px w-full border-b-4 py-4 text-base font-bold uppercase tracking-wide transition-colors sm:text-lg ${
                i === 0
                  ? "text-left"
                  : i === visibleTabs.length - 1
                  ? "text-right"
                  : "text-center"
              } ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== Isi tab ===== */}
        <div className="p-4 sm:p-6">
          {/* INFO */}
          {tab === "info" && (
            <div className="flex flex-col gap-6">
              <InfoItem label="Sinopsis" value={description} />
              <InfoItem label="Tipe" value={show.format ?? show.type} />
              <InfoItem label="Aired Start" value={show.airedStart} />
              <InfoItem label="Studios" value={show.studios} />
              <InfoItem label="Kategori" value={show.genres?.join(", ")} />
            </div>
          )}

          {/* EPISODE */}
          {tab === "episode" && (
            <div>
              {/* Pilihan season (hanya di halaman anime) + progress */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {!isSeasonMode && show.seasons.length > 0 && (
                  <select
                    value={season?.id}
                    onChange={(e) => setSeasonId(e.target.value)}
                    aria-label="Select season"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 sm:w-44"
                  >
                    {show.seasons.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {progress}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-600">
                    {watchedCount} / {episodes.length} episodes watched
                  </p>
                </div>
              </div>

              {/* Kotak daftar episode */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between px-4 py-3">
                  <h2 className="text-lg font-bold text-gray-900">Episodes</h2>
                  <button
                    type="button"
                    disabled={!season}
                    onClick={() => season && onAddEpisode(season.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                    Add Episode
                  </button>
                </div>

                {episodes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center border-t border-gray-200 px-4 py-12 text-center">
                    <svg
                      className="h-10 w-10 text-gray-400"
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
                    <h3 className="mt-3 text-base font-semibold text-gray-900">
                      Belum ada episode
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Klik Add Episode untuk menambahkan episode pertama.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 border-t border-gray-200">
                    {episodes.map((ep) => (
                      <li
                        key={ep.id}
                        className="relative flex items-center gap-2 px-3 py-2.5 transition-colors last:rounded-b-lg hover:bg-gray-50 sm:gap-3"
                      >
                        {/* Nomor */}
                        <span className="w-5 shrink-0 text-center text-sm text-gray-500 sm:w-6">
                          {ep.number}
                        </span>

                        {/* Thumbnail */}
                        {ep.thumbnail ? (
                          <img
                            src={ep.thumbnail}
                            alt=""
                            className="h-10 w-14 shrink-0 rounded-md object-cover sm:h-12 sm:w-20"
                          />
                        ) : (
                          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400 sm:h-12 sm:w-20">
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}

                        {/* Judul (+ catatan bila ada) */}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-gray-900 sm:line-clamp-1">
                            {ep.title}
                          </p>
                          {ep.notes && (
                            <p className="line-clamp-1 text-xs text-gray-500">
                              {ep.notes}
                            </p>
                          )}
                        </div>

                        {/* Tautan nonton */}
                        {ep.link && (
                          <a
                            href={ep.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${ep.title}`}
                            className="shrink-0 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600"
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
                                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                              />
                            </svg>
                          </a>
                        )}

                        {/* Platform */}
                        <span className="hidden w-20 shrink-0 text-xs text-gray-600 sm:block">
                          {ep.platform}
                        </span>

                        {/* Status: centang hijau = sudah, ikon play ungu = belum */}
                        <button
                          type="button"
                          onClick={() => season && onToggleWatched?.(season.id, ep.id)}
                          aria-label={
                            ep.watched ? "Mark as not watched" : "Mark as watched"
                          }
                          aria-pressed={ep.watched}
                          className="shrink-0 rounded-full"
                        >
                          {ep.watched ? (
                            <svg
                              className="h-7 w-7 text-emerald-500"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="11" fill="currentColor" />
                              <path
                                d="M7.5 12.5l3 3 6-6.5"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-7 w-7 text-indigo-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path
                                d="M10 8.5v7l5.5-3.5z"
                                fill="currentColor"
                                stroke="none"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Menu (Edit / Delete) */}
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setMenuId(menuId === ep.id ? null : ep.id)}
                            aria-label="Episode menu"
                            aria-expanded={menuId === ep.id}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 8h16M4 12h16M4 16h16"
                              />
                            </svg>
                          </button>

                          {menuId === ep.id && (
                            <>
                              {/* Lapisan transparan: klik di luar menu menutupnya */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenuId(null)}
                              />
                              <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => handleEditEpisode(ep)}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEpisode(ep)}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* SEASON (hanya di halaman anime) */}
          {tab === "season" && !isSeasonMode && (
            <div>
              {/* Judul + tombol Add Season */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Seasons</h2>
                <button
                  type="button"
                  onClick={onAddSeason}
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14M5 12h14"
                    />
                  </svg>
                  Add Season
                </button>
              </div>

              {show.seasons.length === 0 ? (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
                  <h3 className="text-base font-semibold text-gray-900">
                    Belum ada season
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Klik Add Season untuk menambahkan season pertama.
                  </p>
                </div>
              ) : (
                <ul className="mt-4 flex flex-col gap-2">
                  {show.seasons.map((s) => {
                    const w = s.episodes.filter((e) => e.watched).length;
                    const pct = s.episodes.length
                      ? Math.round((w / s.episodes.length) * 100)
                      : 0;
                    const canDelete = show.seasons.length > 1;

                    return (
                      <li
                        key={s.id}
                        className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white pr-2 transition-colors hover:bg-gray-50"
                      >
                        {/* Kartu season (klik untuk membuka detail season) */}
                        <button
                          type="button"
                          onClick={() => onOpenSeason?.(s.id)}
                          className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left"
                        >
                          {s.poster || show.poster ? (
                            <img
                              src={s.poster || show.poster}
                              alt=""
                              className="h-16 w-11 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-11 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                              <svg
                                className="h-5 w-5"
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

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="truncate text-sm font-semibold text-gray-900">
                                {s.name}
                              </span>
                              <span className="shrink-0 text-xs text-gray-600">
                                {w} / {s.episodes.length} episodes watched
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-indigo-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          <svg
                            className="h-4 w-4 shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        {/* Tombol hapus season (di luar tombol kartu agar tidak bersarang) */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSeason(s)}
                          disabled={!canDelete}
                          aria-label={`Delete ${s.name}`}
                          title={
                            canDelete
                              ? "Delete season"
                              : "Minimal harus ada satu season"
                          }
                          className="shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                        >
                          <svg
                            className="h-5 w-5"
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
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}