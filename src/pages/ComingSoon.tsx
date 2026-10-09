type ComingSoonProps = {
  title: string;
};

// Halaman sementara untuk Tentang, Layanan, Kontak, dan Masuk
export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-lg border border-blue-200 bg-white/80 p-8 text-center backdrop-blur">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Halaman ini sedang disiapkan.
        </p>
      </div>
    </main>
  );
}