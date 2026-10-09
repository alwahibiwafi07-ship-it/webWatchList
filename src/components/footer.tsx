import { ADDRESS, CONTACT_URLS } from "../data/contact";
import {
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "./icons";
import type { NavPage } from "./navbar";

type FooterProps = {
  onNavigate: (page: NavPage) => void;
};

const menu: { label: string; page: NavPage }[] = [
  { label: "Beranda", page: "home" },
  { label: "Tentang", page: "about" },
  { label: "Layanan", page: "services" },
  { label: "Kontak", page: "contact" },
];

const socials = [
  {
    name: "WhatsApp",
    url: CONTACT_URLS.whatsapp,
    tile: "bg-green-50 text-[#25D366]",
    Icon: WhatsAppIcon,
  },
  {
    name: "LinkedIn",
    url: CONTACT_URLS.linkedin,
    tile: "bg-blue-50 text-[#0A66C2]",
    Icon: LinkedInIcon,
  },
  {
    name: "Instagram",
    url: CONTACT_URLS.instagram,
    tile: "bg-pink-50 text-[#E4405F]",
    Icon: InstagramIcon,
  },
  {
    name: "Email",
    url: CONTACT_URLS.email,
    tile: "bg-indigo-50 text-indigo-600",
    Icon: MailIcon,
  },
];

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-blue-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1.5fr]">
          {/* Blok merek */}
          <div>
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-xl font-bold text-indigo-600">
                My Watchlist
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
              Catat, pantau, dan atur tontonan favoritmu di satu tempat.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Menu</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {menu.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="text-sm text-gray-600 transition-colors hover:text-indigo-600"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Kontak</h3>
            <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <span>{ADDRESS}</span>
            </p>

            <div className="mt-4 flex gap-3">
              {socials.map(({ name, url, tile, Icon }) => {
                const hasUrl = url.trim() !== "";
                const boxClass = `flex h-10 w-10 items-center justify-center rounded-lg ${tile}`;

                // URL sudah diisi: jadi tautan. Belum: ikon redup, tidak bisa diklik.
                return hasUrl ? (
                  <a
                    key={name}
                    href={url}
                    target={url.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className={`${boxClass} transition-transform hover:-translate-y-0.5`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ) : (
                  <span
                    key={name}
                    aria-label={`${name} (URL belum diisi)`}
                    title={`${name}: URL belum diisi`}
                    className={`${boxClass} cursor-not-allowed opacity-40`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Baris bawah */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} My Watchlist. Dibuat dengan React.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
            Ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}