import { useState } from "react";
import { STATUS_FILTERS, type StatusFilter } from "../types";

type MainNavbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  filter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
};

export default function MainNavbar({
  search,
  onSearchChange,
  onAddClick,
  filter,
  onFilterChange,
}: MainNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-lg border border-blue-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4">
        {/* Judul */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="hidden text-xl font-bold text-indigo-600 sm:block">
            My Watchlist
          </span>
        </a>

        {/* Kolom pencarian */}
        <div className="relative mx-auto w-full min-w-0 max-w-md flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search my watchlist..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        {/* Tombol Add New */}
        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add New"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden min-[480px]:inline">Add New</span>
        </button>

        {/* Tombol menu (ujung kanan); titik ungu = ada filter aktif */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="relative inline-flex shrink-0 items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
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
          {filter !== "all" && !open && (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600" />
          )}
        </button>
      </div>

      {/* Isi menu: pilihan filter */}
      {open && (
        <>
          {/* Lapisan transparan: klik di luar menu menutupnya */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-lg border border-blue-200 bg-white p-1 shadow-lg">
            <ul className="flex flex-col gap-1">
              {STATUS_FILTERS.map((item) => {
                const active = filter === item.value;
                return (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onFilterChange(item.value);
                        setOpen(false);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                      }`}
                    >
                      {item.label}
                      {active && (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}