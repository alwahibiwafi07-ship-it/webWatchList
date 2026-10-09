import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { Episode } from "./Detail";
import { isValidUrl } from "../utils/platform";
import { resizeImage } from "../utils/resizeImage";

export type EpisodeInput = {
  number: number;
  title: string;
  link: string;
  notes: string;
  watched: boolean;
  thumbnail: string; // data URL gambar, kosong jika tidak ada
};

type EpisodeFormProps = {
  mode: "add" | "edit";
  initial?: Episode; // data awal saat edit
  suggestedNumber?: number; // nomor saran saat add (episode terakhir + 1)
  takenNumbers: number[]; // nomor yang sudah dipakai di season ini
  onBack: () => void;
  onSave: (data: EpisodeInput) => void;
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20"
  }`;

export default function EpisodeForm({
  mode,
  initial,
  suggestedNumber,
  takenNumbers,
  onBack,
  onSave,
}: EpisodeFormProps) {
  const [number, setNumber] = useState(
    initial ? String(initial.number) : suggestedNumber ? String(suggestedNumber) : ""
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [watched, setWatched] = useState(initial?.watched ?? false);
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [thumbError, setThumbError] = useState("");
  const [errors, setErrors] = useState({ number: "", title: "", link: "" });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleThumbChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setThumbError("Only JPG or PNG files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setThumbError("File size must be 2MB or less.");
      e.target.value = "";
      return;
    }

    try {
      const resized = await resizeImage(file, 320);
      setThumbnail(resized);
      setThumbError("");
    } catch {
      setThumbError("Failed to read the image.");
      e.target.value = "";
    }
  };

  const handleRemoveThumb = () => {
    setThumbnail("");
    setThumbError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const num = Number(number);
    const newErrors = { number: "", title: "", link: "" };

    if (!number.trim()) {
      newErrors.number = "Episode number is required.";
    } else if (!Number.isInteger(num) || num < 1) {
      newErrors.number = "Enter a whole number of 1 or more.";
    } else if (takenNumbers.includes(num)) {
      newErrors.number = `Episode ${num} already exists in this season.`;
    }

    if (!title.trim()) newErrors.title = "Episode title is required.";

    if (!link.trim()) {
      newErrors.link = "Link is required.";
    } else if (!isValidUrl(link.trim())) {
      newErrors.link = "Enter a valid link starting with http:// or https://";
    }

    setErrors(newErrors);
    if (newErrors.number || newErrors.title || newErrors.link) return;

    onSave({
      number: num,
      title: title.trim(),
      link: link.trim(),
      notes: notes.trim(),
      watched,
      thumbnail,
    });
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
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
            {mode === "add" ? "Add Episode" : "Edit Episode"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {/* Thumbnail (foto episode) */}
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Thumbnail (Optional)
            </p>
            <label
              htmlFor="thumbnail"
              className="relative flex aspect-video w-full max-w-xs cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 text-center transition-colors hover:border-indigo-600 hover:bg-indigo-50/40 focus-within:border-indigo-600"
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
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
                  <span className="mt-2 text-sm font-semibold text-gray-900">
                    Upload Thumbnail
                  </span>
                  <span className="mt-0.5 text-xs text-gray-600">
                    JPG, PNG (Max. 2MB)
                  </span>
                </>
              )}
              <input
                id="thumbnail"
                ref={fileRef}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleThumbChange}
                className="sr-only"
              />
            </label>
            {thumbnail && (
              <button
                type="button"
                onClick={handleRemoveThumb}
                className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Remove thumbnail
              </button>
            )}
            {thumbError && (
              <p className="mt-2 text-xs text-red-600">{thumbError}</p>
            )}
          </div>

          {/* Episode Number */}
          <div>
            <label
              htmlFor="number"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Episode Number <span className="text-red-500">*</span>
            </label>
            <input
              id="number"
              type="number"
              inputMode="numeric"
              min={1}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. 1"
              className={inputClass(!!errors.number)}
            />
            {errors.number && (
              <p className="mt-1 text-xs text-red-600">{errors.number}</p>
            )}
          </div>

          {/* Episode Title */}
          <div>
            <label
              htmlFor="ep-title"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Episode Title <span className="text-red-500">*</span>
            </label>
            <input
              id="ep-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Flame Hashira Kyojuro Rengoku"
              className={inputClass(!!errors.title)}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Link */}
          <div>
            <label
              htmlFor="link"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Link (YouTube / Netflix / Others){" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={inputClass(!!errors.link)}
            />
            {errors.link && (
              <p className="mt-1 text-xs text-red-600">{errors.link}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes for this episode..."
              className={`${inputClass(false)} resize-y`}
            />
          </div>

          {/* Status */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-gray-700">
              Status
            </legend>
            <div className="flex gap-6">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="status"
                  checked={!watched}
                  onChange={() => setWatched(false)}
                  className="h-4 w-4 accent-indigo-600"
                />
                Not Watched
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="status"
                  checked={watched}
                  onChange={() => setWatched(true)}
                  className="h-4 w-4 accent-indigo-600"
                />
                Watched
              </label>
            </div>
          </fieldset>

          {/* Tombol aksi */}
          <div className="mt-2 flex justify-end gap-3">
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
              Save Episode
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}