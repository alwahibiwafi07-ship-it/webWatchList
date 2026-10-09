import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { resizeImage } from "../utils/resizeImage";

export type SeasonInput = {
  title: string;
  description: string;
  poster: string; // data URL gambar, kosong jika tidak ada
};

type SeasonFormProps = {
  showTitle: string; // nama anime induk (ditampilkan sebagai keterangan)
  suggestedTitle: string; // contoh: "Season 2"
  takenNames: string[]; // nama season yang sudah ada di anime ini
  onBack: () => void;
  onSave: (data: SeasonInput) => void;
};

const MAX_POSTER_SIZE = 2 * 1024 * 1024; // 2MB

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20"
  }`;

export default function SeasonForm({
  showTitle,
  suggestedTitle,
  takenNames,
  onBack,
  onSave,
}: SeasonFormProps) {
  const [title, setTitle] = useState(suggestedTitle);
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [posterError, setPosterError] = useState("");
  const [titleError, setTitleError] = useState("");

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = title.trim();
    if (!name) {
      setTitleError("Title is required.");
      return;
    }
    if (takenNames.some((n) => n.trim().toLowerCase() === name.toLowerCase())) {
      setTitleError(`"${name}" already exists in this show.`);
      return;
    }

    onSave({ title: name, description: description.trim(), poster });
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
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Add Season</h1>
            <p className="truncate text-sm text-gray-600">{showTitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6">
          <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
            {/* Upload poster */}
            <div>
              <label
                htmlFor="season-poster"
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
                  id="season-poster"
                  ref={fileRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handlePosterChange}
                  className="sr-only"
                />
              </label>

              {poster && (
                <button
                  type="button"
                  onClick={handleRemovePoster}
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Remove poster
                </button>
              )}
              {posterError && (
                <p className="mt-2 text-xs text-red-600">{posterError}</p>
              )}
            </div>

            {/* Kolom isian */}
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="season-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="season-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleError("");
                  }}
                  placeholder="e.g. Season 2"
                  className={inputClass(!!titleError)}
                />
                {titleError && (
                  <p className="mt-1 text-xs text-red-600">{titleError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="season-description"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="season-description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description about this season..."
                  className={`${inputClass(false)} resize-y`}
                />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}