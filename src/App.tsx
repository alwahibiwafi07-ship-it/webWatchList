import { useEffect, useState } from "react";
import Navbar, { type NavPage } from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import AddNew, { type NewShow } from "./pages/addNew";
import Detail, { type Episode, type Season, type ShowDetail } from "./pages/Detail";
import EpisodeForm, { type EpisodeInput } from "./pages/EpisodeForm";
import SeasonForm, { type SeasonInput } from "./pages/SeasonForm";
import ComingSoon from "./pages/ComingSoon";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getPlatform } from "./utils/platform";
import BackButton from "./components/BackButton";

type Page =
  | NavPage
  | "add"
  | "editShow"
  | "detail"
  | "seasonForm"
  | "season"
  | "episode";

// Episode yang sedang ditambah/diedit (episodeId kosong = tambah baru).
// "from" = halaman asal, supaya setelah selesai kembali ke tempat yang sama.
type EpisodeTarget = {
  seasonId: string;
  episodeId?: string;
  from: "detail" | "season";
};

const sortByNumber = (episodes: Episode[]) =>
  [...episodes].sort((a, b) => a.number - b.number);

function App() {
  const [shows, setShows] = useLocalStorage<ShowDetail[]>("mywatch:shows", []);
  const [page, setPage] = useState<Page>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null);
  const [episodeTarget, setEpisodeTarget] = useState<EpisodeTarget | null>(null);

  const selectedShow = shows.find((s) => s.id === selectedId);

  // Menu navbar yang sedang aktif: halaman informasi, atau "home" untuk
  // semua halaman aplikasi (daftar, detail, form, dan seterusnya)
  const activeNav: NavPage =
    page === "about" || page === "services" || page === "contact" || page === "login"
      ? page
      : "home";

  // Footer hanya tampil di empat halaman utama
  const showFooter =
    page === "home" || page === "about" || page === "services" || page === "contact";

  // Data untuk form episode
  const targetSeason = selectedShow?.seasons.find(
    (s) => s.id === episodeTarget?.seasonId
  );
  const editingEpisode = targetSeason?.episodes.find(
    (e) => e.id === episodeTarget?.episodeId
  );
  const takenNumbers = (targetSeason?.episodes ?? [])
    .filter((e) => e.id !== editingEpisode?.id)
    .map((e) => e.number);
  const suggestedNumber =
    Math.max(0, ...(targetSeason?.episodes.map((e) => e.number) ?? [])) + 1;

  // Setiap pindah halaman, kembali ke atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // ===== Navigasi (navbar utama dan footer) =====
  const handleNavigate = (target: NavPage) => {
    setEpisodeTarget(null);
    setPage(target);
  };

  // ===== Film =====
  const handleSave = (data: NewShow) => {
    const newShow: ShowDetail = {
      id: crypto.randomUUID(),
      title: data.title,
      type: data.type,
      format: data.format,
      description: data.description,
      airedStart: data.airedStart,
      studios: data.studios,
      genres: data.genres,
      poster: data.poster,
      favorite: false,
      seasons: [{ id: crypto.randomUUID(), name: "Season 1", episodes: [] }],
    };

    setShows((prev) => [newShow, ...prev]);
    setPage("home");
  };

  // Simpan hasil edit: data baru menimpa data lama, sedangkan id, favorit,
  // season, dan episode tetap karena memakai { ...show, ...data }
  const handleUpdateShow = (data: NewShow) => {
    setShows((prev) =>
      prev.map((show) => (show.id === selectedId ? { ...show, ...data } : show))
    );
    setPage("detail");
  };

  const handleOpen = (id: string) => {
    setSelectedId(id);
    setActiveSeasonId(null);
    setPage("detail");
  };

  const handleDelete = (id: string) => {
    setShows((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleFavorite = () => {
    setShows((prev) =>
      prev.map((s) => (s.id === selectedId ? { ...s, favorite: !s.favorite } : s))
    );
  };

  // ===== Season =====
  const handleSaveSeason = (data: SeasonInput) => {
    const newSeason: Season = {
      id: crypto.randomUUID(),
      name: data.title,
      description: data.description,
      poster: data.poster,
      episodes: [],
    };

    setShows((prev) =>
      prev.map((show) =>
        show.id === selectedId
          ? { ...show, seasons: [...show.seasons, newSeason] }
          : show
      )
    );
    setPage("detail");
  };

  const handleOpenSeason = (seasonId: string) => {
    setActiveSeasonId(seasonId);
    setPage("season");
  };

  const handleDeleteSeason = (seasonId: string) => {
    // Pengaman: anime harus selalu punya minimal satu season
    if (!selectedShow || selectedShow.seasons.length <= 1) return;

    setShows((prev) =>
      prev.map((show) =>
        show.id !== selectedId
          ? show
          : { ...show, seasons: show.seasons.filter((s) => s.id !== seasonId) }
      )
    );

    if (activeSeasonId === seasonId) setActiveSeasonId(null);
  };

  // ===== Episode (pada film yang sedang dibuka) =====
  const updateSeason = (seasonId: string, update: (season: Season) => Season) => {
    setShows((prev) =>
      prev.map((show) =>
        show.id !== selectedId
          ? show
          : {
              ...show,
              seasons: show.seasons.map((s) => (s.id === seasonId ? update(s) : s)),
            }
      )
    );
  };

  const handleToggleWatched = (seasonId: string, episodeId: string) => {
    updateSeason(seasonId, (season) => ({
      ...season,
      episodes: season.episodes.map((ep) =>
        ep.id === episodeId ? { ...ep, watched: !ep.watched } : ep
      ),
    }));
  };

  const handleDeleteEpisode = (seasonId: string, episodeId: string) => {
    updateSeason(seasonId, (season) => ({
      ...season,
      episodes: season.episodes.filter((ep) => ep.id !== episodeId),
    }));
  };

  const openEpisodeForm = (
    seasonId: string,
    from: "detail" | "season",
    episodeId?: string
  ) => {
    setEpisodeTarget({ seasonId, episodeId, from });
    setPage("episode");
  };

  const handleSaveEpisode = (data: EpisodeInput) => {
    if (!episodeTarget) return;
    const { seasonId, episodeId, from } = episodeTarget;
    const fields = { ...data, platform: getPlatform(data.link) };

    updateSeason(seasonId, (season) => {
      const episodes: Episode[] = episodeId
        ? season.episodes.map((ep) => (ep.id === episodeId ? { ...ep, ...fields } : ep))
        : [...season.episodes, { id: crypto.randomUUID(), ...fields }];

      return { ...season, episodes: sortByNumber(episodes) };
    });

    setEpisodeTarget(null);
    setPage(from);
  };
  // Halaman informasi (selain Beranda) mendapat tombol back
  const isInfoPage = activeNav !== "home";
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar currentPage={activeNav} onNavigate={handleNavigate} />

      {/* Isi halaman: flex-1 mendorong footer ke dasar layar */}
      <div className="flex-1">
                {/* Tombol back untuk halaman Tentang, Layanan, Kontak, dan Masuk */}
        {isInfoPage && (
          <div className="mx-auto flex max-w-4xl justify-start px-4 pt-6">
            <BackButton onClick={() => handleNavigate("home")} />
          </div>
        )}
        {page === "home" && (
          <Home
            shows={shows}
            onAddClick={() => setPage("add")}
            onOpen={handleOpen}
            onDelete={handleDelete}
          />
        )}

        {page === "add" && (
          <AddNew onBack={() => setPage("home")} onSave={handleSave} />
        )}

        {/* Halaman informasi */}
        {page === "about" && <About />}
        {page === "services" && <Services />}
        {page === "contact" && <Contact />}
        {page === "login" && <ComingSoon title="Masuk" />}

        {/* Detail anime: tetap "hidup" (hanya disembunyikan) saat form atau
            halaman season dibuka, supaya tab yang dipilih tidak kembali ke awal */}
        {selectedShow &&
          ["detail", "editShow", "seasonForm", "season", "episode"].includes(page) && (
            <div className={page === "detail" ? "" : "hidden"}>
              <Detail
                key={selectedShow.id}
                show={selectedShow}
                onBack={() => setPage("home")}
                onToggleFavorite={handleToggleFavorite}
                onToggleWatched={handleToggleWatched}
                onAddEpisode={(seasonId) => openEpisodeForm(seasonId, "detail")}
                onEditEpisode={(seasonId, episodeId) =>
                  openEpisodeForm(seasonId, "detail", episodeId)
                }
                onDeleteEpisode={handleDeleteEpisode}
                onOpenSeason={handleOpenSeason}
                onAddSeason={() => setPage("seasonForm")}
                onDeleteSeason={handleDeleteSeason}
                onEdit={() => setPage("editShow")}
              />
            </div>
          )}

        {/* Halaman edit tontonan: form Add New yang sudah terisi data lama */}
        {page === "editShow" && selectedShow && (
          <AddNew
            key={selectedShow.id}
            mode="edit"
            initial={{
              title: selectedShow.title,
              type: selectedShow.type,
              format: selectedShow.format,
              description: selectedShow.description,
              airedStart: selectedShow.airedStart,
              studios: selectedShow.studios,
              genres: selectedShow.genres,
              poster: selectedShow.poster,
            }}
            onBack={() => setPage("detail")}
            onSave={handleUpdateShow}
          />
        )}

        {/* Halaman detail satu season */}
        {selectedShow &&
          activeSeasonId &&
          (page === "season" ||
            (page === "episode" && episodeTarget?.from === "season")) && (
            <div className={page === "season" ? "" : "hidden"}>
              <Detail
                key={`season-${activeSeasonId}`}
                show={selectedShow}
                focusSeasonId={activeSeasonId}
                onBack={() => setPage("detail")}
                onToggleWatched={handleToggleWatched}
                onAddEpisode={(seasonId) => openEpisodeForm(seasonId, "season")}
                onEditEpisode={(seasonId, episodeId) =>
                  openEpisodeForm(seasonId, "season", episodeId)
                }
                onDeleteEpisode={handleDeleteEpisode}
              />
            </div>
          )}

        {page === "seasonForm" && selectedShow && (
          <SeasonForm
            showTitle={selectedShow.title}
            suggestedTitle={`Season ${selectedShow.seasons.length + 1}`}
            takenNames={selectedShow.seasons.map((s) => s.name)}
            onBack={() => setPage("detail")}
            onSave={handleSaveSeason}
          />
        )}

        {page === "episode" && selectedShow && episodeTarget && (
          <EpisodeForm
            key={`${episodeTarget.seasonId}-${episodeTarget.episodeId ?? "new"}`}
            mode={episodeTarget.episodeId ? "edit" : "add"}
            initial={editingEpisode}
            suggestedNumber={suggestedNumber}
            takenNumbers={takenNumbers}
            onBack={() => {
              const from = episodeTarget.from;
              setEpisodeTarget(null);
              setPage(from);
            }}
            onSave={handleSaveEpisode}
          />
        )}
      </div>

      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;