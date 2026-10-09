export const SHOW_TYPES = ["Anime", "Donghua", "Film Movie", "Drama China"] as const;

export type ShowType = (typeof SHOW_TYPES)[number];
// Jenis tontonan (ditampilkan sebagai "Tipe")
export const SHOW_FORMATS = ["TV Series", "Movie", "OVA", "ONA", "Special"] as const;
export type ShowFormat = (typeof SHOW_FORMATS)[number];

// Genre yang bisa dipilih di form (ditampilkan sebagai "Kategori" di tab Info)
export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Demons",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Magic",
  "Martial Arts",
  "Mecha",
  "Military",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "School",
  "Sci-Fi",
  "Seinen",
  "Shounen",
  "Slice of Life",
  "Supernatural",
  "Thriller",
] as const;

// Filter status di Home (menu pada navbar kedua)
export const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "watching", label: "Sedang Ditonton" },
  { value: "completed", label: "Selesai" },
] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];