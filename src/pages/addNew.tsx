import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  GENRES,
  SHOW_FORMATS,
  SHOW_TYPES,
  type ShowFormat,
  type ShowType,
} from "../types";
import { resizeImage } from "../utils/resizeImage";

export type NewShow = {
  title: string;
  type: ShowType; // Category: dipakai untuk mengelompokkan di Home
  format: ShowFormat; // Type: jenis tontonan (TV Series, Movie, OVA, ...)
  description: string; // sinopsis
  airedStart: string; // contoh: "2006-02-10"
  studios: string; // contoh: "Madhouse, Satelight"
  genres: string[];
  poster: string; // data URL gambar, kosong jika tidak ada
};

type AddNewProps = {
  mode?: "add" | "edit";
  initial?: Partial<NewShow>; // data awal saat edit
  onBack: () => void;
  onSave: (show: NewShow) => void;
};

const MAX_POSTER_SIZE = 2 * 1024 * 1024; // 2MB

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20"
  }`;

export default function AddNew({
  mode = "add",
  initial,
  onBack,
  onSave,
}: AddNewProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [type, setType] = useState<ShowType | "">(initial?.type ?? "");
  const [format, setFormat] = useState<ShowFormat | "">(initial?.format ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [airedStart, setAiredStart] = useState(initial?.airedStart ?? "");
  const [studios, setStudios] = useState(initial?.studios ?? "");
  const [genres, setGenres] = useState<string[]>(initial?.genres ?? []);
  const [poster, setPoster] = useState(initial?.poster ?? "");
  const [posterError, setPosterError] = useState("");
  const [errors, setErrors] = useState({ title: "", type: "", format: "" });

  const fileRef = useRef<HTMLInputElement>(null);

  const handlePosterChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPosterError("Only JPG or PNG files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_POSTER_SIZE) {
      setPosterError("File size must be 2MB or less.");
      e.target.value = "";
      return;
    }

    try {
      const resized = await resizeImage(file, 400);
      setPoster(resized);
      setPosterError("");
    } catch {
      setPosterError("Failed to read the image.");
      e.target.value = "";
    }
  };

  const handleRemovePoster = () => {
    setPoster("");
    setPosterError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // Pilih / batal pilih sebuah genre
  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleError = title.trim() ? "" : "Title is required.";
    const typeError = type ? "" : "Please select a category.";
    const formatError = format ? "" : "Please select a type.";
    setErrors({ title: titleError, type: typeError, format: formatError });

    if (titleError || !type || !format) return;

    onSave({
      title: title.trim(),
      type,
      format,
      description: description.trim(),
      airedStart,
      studios: studios.trim(),
      genres,
      poster,
    });
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-blue-200 bg-white/80 p-6 backdrop-blur">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
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
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "edit" ? "Edit Show / Movie" : "Add New Show / Movie"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
            {/* Upload poster */}
            <div>
              <label
                htmlFor="poster"
                className="relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 text-center transition-colors hover:border-indigo-600 hover:bg-indigo-50/40 focus-within:border-indigo-600"
              >
                {poster ? (
                  <img
                    src={poster}
                    alt="Poster preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <svg
                      className="h-8 w-8 text-gray-400"
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
                    <span className="mt-3 text-sm font-semibold text-gray-900">
                      Upload Poster
                    </span>
                    <span className="mt-1 text-xs text-gray-600">
                      JPG, PNG (Max. 2MB)
                    </span>
                  </>
                )}
                <input
                  id="poster"
                  ref={fileRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handlePosterChange}
                  className="sr-only"
                />
              </label>

              {/* Ganti / hapus poster */}
              {poster && (
                <div className="mt-2 flex gap-2">
                  <label
                    htmlFor="poster"
                    className="flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white py-1.5 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Change poster
                  </label>
                  <button
                    type="button"
                    onClick={handleRemovePoster}
                    aria-label="Remove poster"
                    className="rounded-lg border border-gray-200 bg-white px-2.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
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
                </div>
              )}
              {posterError && (
                <p className="mt-2 text-xs text-red-600">{posterError}</p>
              )}
            </div>

            {/* Kolom isian */}
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Attack on Titan"
                  className={inputClass(!!errors.title)}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Category & Type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={type}
                    onChange={(e) => setType(e.target.value as ShowType | "")}
                    className={inputClass(!!errors.type)}
                  >
                    <option value="">Select category</option>
                    {SHOW_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="format"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="format"
                    value={format}
                    onChange={(e) =>
                      setFormat(e.target.value as ShowFormat | "")
                    }
                    className={inputClass(!!errors.format)}
                  >
                    <option value="">Select type</option>
                    {SHOW_FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  {errors.format && (
                    <p className="mt-1 text-xs text-red-600">{errors.format}</p>
                  )}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Synopsis (Optional)
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short synopsis about this show or movie..."
                  className={`${inputClass(false)} resize-y`}
                />
              </div>

              {/* Aired Start & Studios */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="aired-start"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Aired Start (Optional)
                  </label>
                  <input
                    id="aired-start"
                    type="date"
                    value={airedStart}
                    onChange={(e) => setAiredStart(e.target.value)}
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="studios"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Studios (Optional)
                  </label>
                  <input
                    id="studios"
                    type="text"
                    value={studios}
                    onChange={(e) => setStudios(e.target.value)}
                    placeholder="e.g. Madhouse, Satelight"
                    className={inputClass(false)}
                  />
                </div>
              </div>

              {/* Genre */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Genre (Optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => {
                    const active = genres.includes(genre);
                    return (
                      <button
                        key={genre}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleGenre(genre)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {mode === "edit" ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}