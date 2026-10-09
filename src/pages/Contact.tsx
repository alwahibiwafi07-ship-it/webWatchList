import type { ComponentType } from "react";
import ContactForm from "../components/ContactForm";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "../components/icons";
import { ADDRESS, CONTACT_URLS } from "../data/contact";

type ContactItem = {
  name: string;
  description: string;
  url: string;
  tile: string; // warna latar ikon
  Icon: ComponentType<{ className?: string }>;
};

const contacts: ContactItem[] = [
  {
    name: "WhatsApp",
    description: "Kirim pesan langsung",
    url: CONTACT_URLS.whatsapp,
    tile: "bg-green-50 text-[#25D366]",
    Icon: WhatsAppIcon,
  },
  {
    name: "LinkedIn",
    description: "Terhubung secara profesional",
    url: CONTACT_URLS.linkedin,
    tile: "bg-blue-50 text-[#0A66C2]",
    Icon: LinkedInIcon,
  },
  {
    name: "Instagram",
    description: "Ikuti aktivitas terbaru",
    url: CONTACT_URLS.instagram,
    tile: "bg-pink-50 text-[#E4405F]",
    Icon: InstagramIcon,
  },
  {
    name: "Email",
    description: "Kirim email",
    url: CONTACT_URLS.email,
    tile: "bg-indigo-50 text-indigo-600",
    Icon: MailIcon,
  },
];

export default function Contact() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-lg border border-blue-200 bg-white/80 p-6 backdrop-blur sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Kontak</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
          Punya pertanyaan atau saran untuk MyWatch? Hubungi saya lewat salah
          satu kanal di bawah ini.
        </p>

        <ContactForm />

        {/* Alamat */}
        <div className="mt-6 flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <MapPinIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">Alamat</p>
            <p className="mt-1 text-sm text-gray-700">{ADDRESS}</p>
          </div>
        </div>

        {/* Kanal kontak */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => {
            const hasUrl = contact.url.trim() !== "";

            const content = (
              <>
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${contact.tile}`}
                >
                  <contact.Icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">
                    {contact.name}
                  </span>
                  <span className="block text-xs text-gray-600">
                    {hasUrl ? contact.description : "URL belum diisi"}
                  </span>
                </span>
              </>
            );

            const baseClass =
              "flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4";

            // Kalau URL sudah diisi: jadi tautan. Kalau belum: kartu biasa.
            return hasUrl ? (
              <a
                key={contact.name}
                href={contact.url}
                target={contact.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`${baseClass} transition-colors hover:border-indigo-300 hover:bg-gray-50`}
              >
                {content}
              </a>
            ) : (
              <div key={contact.name} className={`${baseClass} opacity-70`}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}