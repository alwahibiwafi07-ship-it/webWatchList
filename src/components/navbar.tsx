import { useEffect, useRef, useState } from "react";

export type NavPage = "home" | "about" | "services" | "contact" | "login";

const links: { label: string; page: NavPage }[] = [
  { label: "Beranda", page: "home" },
  { label: "Tentang", page: "about" },
  { label: "Layanan", page: "services" },
  { label: "Kontak", page: "contact" },
];

type NavbarProps = {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Saat menu terbuka: tutup kalau pengguna menekan di luar navbar, atau menekan Esc
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return;
      if (headerRef.current?.contains(e.target)) return; // di dalam navbar
      if (e.target.closest("[data-keep-menu-open]")) return; // contoh: tombol back
      setOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white/80 backdrop-blur"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-xl font-bold text-indigo-600"
        >
          My Watchlist
        </button>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = currentPage === link.page;
            return (
              <li key={link.label}>
                <button
                  type="button"
                  onClick={() => onNavigate(link.page)}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                    active ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Tombol aksi desktop */}
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 md:inline-block"
        >
          Masuk
        </button>

        {/* Tombol hamburger (layar kecil) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Menu layar kecil: kartu melayang di sisi kanan, tetap terbuka saat pindah halaman */}
      {open && (
        <div className="absolute right-4 top-full mt-2 w-60 rounded-lg border border-blue-200 bg-white p-2 shadow-lg md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = currentPage === link.page;
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.page)}
                    aria-current={active ? "page" : undefined}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
            <li>

            </li>
          </ul>
        </div>
      )}
    </header>
  );
}