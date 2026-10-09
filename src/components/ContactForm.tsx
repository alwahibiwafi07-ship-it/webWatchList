import { useState, type FormEvent } from "react";


const WHATSAPP_NUMBER = "6285194708015";

// Ubah ke format wa.me: hanya angka, diawali kode negara (0 di depan menjadi 62)
const normalizeNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
};

const inputClass = (hasError: boolean) =>
  `w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:ring-2 ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-200 focus:border-indigo-600 focus:ring-indigo-600/20"
  }`;

type Errors = { name: string; phone: string; subject: string; message: string };
const emptyErrors: Errors = { name: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>(emptyErrors);
  const [notice, setNotice] = useState<"" | "sent" | "no-number">("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice("");

    // Validasi
    const phoneDigits = phone.replace(/\D/g, "");
    const newErrors: Errors = {
      name: name.trim() ? "" : "Nama wajib diisi.",
      phone:
        phoneDigits.length >= 8 && phoneDigits.length <= 15
          ? ""
          : "Masukkan nomor ponsel yang valid.",
      subject: subject.trim() ? "" : "Subjek wajib diisi.",
      message: message.trim() ? "" : "Pesan wajib diisi.",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    // Nomor tujuan belum diisi di bagian atas file ini
    const target = normalizeNumber(WHATSAPP_NUMBER);
    if (!target) {
      setNotice("no-number");
      return;
    }

    // Susun isi pesan
    const text = [
      `Halo, saya ${name.trim()}.`,
      "",
      `*Subjek:* ${subject.trim()}`,
      "",
      message.trim(),
      "",
      `Nomor saya: ${phone.trim()}`,
    ].join("\n");

    // Buka WhatsApp dengan pesan yang sudah terisi
    window.open(
      `https://wa.me/${target}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    setName("");
    setPhone("");
    setSubject("");
    setMessage("");
    setNotice("sent");
  };

  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-gray-900">Hubungi Saya</h2>
      <p className="mt-1 text-sm text-gray-600">Hubungi saya via WhatsApp!</p>

      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              aria-label="Nama Anda"
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ponsel Anda"
              aria-label="Ponsel Anda"
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subjek"
            aria-label="Subjek"
            className={inputClass(!!errors.subject)}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
          )}
        </div>

        <div>
          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Pesan Anda"
            aria-label="Pesan Anda"
            className={`${inputClass(!!errors.message)} resize-y`}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Kirim ke WhatsApp
          </button>

          {notice === "sent" && (
            <p className="mt-3 text-sm text-green-700">
              WhatsApp dibuka di tab baru. Tekan tombol kirim di WhatsApp untuk
              menyelesaikan pengiriman.
            </p>
          )}
          {notice === "no-number" && (
            <p className="mt-3 text-sm text-amber-700">
              Nomor WhatsApp tujuan belum diisi. Isi{" "}
              <code className="rounded bg-amber-50 px-1">WHATSAPP_NUMBER</code>{" "}
              di bagian atas file ContactForm.tsx.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}