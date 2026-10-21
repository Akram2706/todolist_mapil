
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil data produk");
      }

      setProducts(Array.isArray(data) ? data : data.products || []);
      setError("");
    } catch (err) {
      setError(err.message || "Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setNama("");
    setHarga("");
    setStok("");
    setEditId(null);
  }

  function startEdit(product) {
    setEditId(product.id);
    setNama(product.nama_produk);
    setHarga(product.harga);
    setStok(product.stok);
    setPesan("");
    setError("");

    document.getElementById("product-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  async function saveProduct(e) {
    e.preventDefault();
    setSaving(true);
    setPesan("");
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          nama_produk: nama.trim(),
          harga: Number(harga),
          stok: Number(stok),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyimpan produk");
      }

      setPesan(
        editId
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan."
      );

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    setPesan("");
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus produk");
      }

      setPesan("Produk berhasil dihapus.");

      if (editId === id) resetForm();

      await loadProducts();
    } catch (err) {
      setError(err.message || "Gagal menghapus produk");
    }
  }

  const filteredProducts = products.filter((product) =>
    product.nama_produk?.toLowerCase().includes(search.toLowerCase())
  );

  const totalStok = products.reduce(
    (total, product) => total + Number(product.stok || 0),
    0
  );

  const totalNilai = products.reduce(
    (total, product) =>
      total + Number(product.harga || 0) * Number(product.stok || 0),
    0
  );

  const rupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const inputClass =
    "w-full rounded-xl border border-[#303143] bg-[#14151F] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#66677B] focus:border-violet-500";

  return (
    <main className="min-h-screen bg-[#101119] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#292A39] bg-[#14151F] p-6 md:flex">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold">
              N
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-wide">NEXUS</h2>
              <p className="text-xs text-[#85869A]">Product Manager</p>
            </div>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#77788D]">
            MENU
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-violet-400/10 bg-violet-500/15 px-4 py-3 text-sm font-medium text-violet-300">
            <span>▦</span>
            Produk
          </div>

          <p className="mt-6 border-t border-[#292A39] pt-5 text-xs leading-6 text-[#77788D]">
            Kelola produk, harga, dan persediaan barang.
          </p>

          <div className="mt-auto pt-8 text-xs text-[#65667A]">
            Inventory Management
          </div>
        </aside>

        {/* KONTEN UTAMA */}
        <div className="min-w-0 flex-1">
          {/* HEADER */}
          <header className="border-b border-[#292A39] px-5 py-6 sm:px-9">
            <p className="text-xs text-[#85869A]">
              Workspace / Inventory
            </p>
            <h1 className="mt-2 text-xl font-semibold">
              Product Management
            </h1>
          </header>

          <div className="mx-auto max-w-[1600px] space-y-7 p-5 sm:p-8 lg:p-9">
            {/* JUDUL */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                INVENTORY OVERVIEW
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Ringkasan Inventaris
              </h2>

              <p className="mt-2 text-sm text-[#85869A]">
                Pantau jumlah barang, persediaan, dan nilai produk.
              </p>
            </section>

            {/* STATISTIK */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#292A39] bg-[#1B1C29] p-5">
                <p className="text-sm text-[#999AAF]">Total Produk</p>
                <p className="mt-4 text-3xl font-bold text-violet-300">
                  {products.length}
                </p>
                <p className="mt-2 text-xs text-[#77788D]">
                  Jenis produk terdaftar
                </p>
              </div>

              <div className="rounded-2xl border border-[#292A39] bg-[#1B1C29] p-5">
                <p className="text-sm text-[#999AAF]">Total Stok</p>
                <p className="mt-4 text-3xl font-bold text-sky-300">
                  {totalStok.toLocaleString("id-ID")}
                </p>
                <p className="mt-2 text-xs text-[#77788D]">
                  Unit seluruh produk
                </p>
              </div>

              <div className="rounded-2xl border border-[#292A39] bg-[#1B1C29] p-5">
                <p className="text-sm text-[#999AAF]">Nilai Inventaris</p>
                <p className="mt-4 break-words text-2xl font-bold text-emerald-300">
                  {rupiah(totalNilai)}
                </p>
                <p className="mt-2 text-xs text-[#77788D]">
                  Harga dikali jumlah stok
                </p>
              </div>
            </section>

            {/* NOTIFIKASI */}
            {pesan && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {pesan}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            {/* FORM PRODUK */}
            <section
              id="product-form"
              className="rounded-2xl border border-[#292A39] bg-[#1B1C29] p-5 sm:p-6"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-300">
                    {editId ? "EDIT PRODUK" : "PRODUK BARU"}
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    {editId ? "Ubah Informasi Produk" : "Tambah Produk"}
                  </h2>
                </div>

                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-[#999AAF] hover:text-white"
                  >
                    Batal edit
                  </button>
                )}
              </div>

              <form onSubmit={saveProduct}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm text-[#C2C2D1]">
                      Nama Produk
                    </label>
                    <input
                      className={inputClass}
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama produk"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#C2C2D1]">
                      Harga (Rp)
                    </label>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      placeholder="25000"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#C2C2D1]">
                      Stok
                    </label>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="1"
                      value={stok}
                      onChange={(e) => setStok(e.target.value)}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
                  >
                    {saving
                      ? "Menyimpan..."
                      : editId
                        ? "Simpan Perubahan"
                        : "+ Tambah Produk"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-[#36374A] px-5 py-3 text-sm text-[#C2C2D1] transition hover:bg-[#252637]"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>

            {/* TABEL PRODUK */}
            <section className="overflow-hidden rounded-2xl border border-[#292A39] bg-[#1B1C29]">
              <div className="flex flex-col gap-4 border-b border-[#292A39] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Daftar Produk
                  </h2>
                  <p className="mt-1 text-sm text-[#85869A]">
                    Lihat dan kelola semua produk.
                  </p>
                </div>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="w-full rounded-xl border border-[#303143] bg-[#14151F] px-4 py-3 text-sm text-white outline-none placeholder:text-[#66677B] focus:border-violet-500 sm:w-64"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-[#202130] text-xs uppercase tracking-wider text-[#999AAF]">
                    <tr>
                      <th className="px-5 py-4">No.</th>
                      <th className="px-5 py-4">Nama Produk</th>
                      <th className="px-5 py-4">Harga</th>
                      <th className="px-5 py-4">Stok</th>
                      <th className="px-5 py-4">Nilai Stok</th>
                      <th className="px-5 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#292A39]">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-[#85869A]"
                        >
                          Memuat data produk...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-5 py-12 text-center text-[#85869A]"
                        >
                          {search
                            ? "Produk tidak ditemukan."
                            : "Belum ada produk. Tambahkan produk melalui formulir di atas."}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <tr
                          key={product.id}
                          className="transition hover:bg-[#222333]"
                        >
                          <td className="px-5 py-5 text-[#85869A]">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-5 py-5 font-medium text-white">
                            {product.nama_produk}
                          </td>

                          <td className="px-5 py-5 text-[#C2C2D1]">
                            {rupiah(Number(product.harga))}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                                Number(product.stok) <= 3
                                  ? "bg-amber-400/10 text-amber-300"
                                  : "bg-emerald-400/10 text-emerald-300"
                              }`}
                            >
                              {product.stok} unit
                            </span>
                          </td>

                          <td className="px-5 py-5 text-[#C2C2D1]">
                            {rupiah(
                              Number(product.harga) *
                                Number(product.stok)
                            )}
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-4">
                              <button
                                type="button"
                                onClick={() => startEdit(product)}
                                className="font-medium text-violet-300 hover:text-violet-200"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteProduct(product.id)}
                                className="font-medium text-rose-300 hover:text-rose-200"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#292A39] px-5 py-4">
                <p className="text-xs text-[#85869A]">
                  Menampilkan {filteredProducts.length} dari {products.length} produk
                </p>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="text-xs font-medium text-violet-300 hover:text-violet-200"
                >
                  Muat ulang data
                </button>
              </div>
            </section>

            <footer className="py-4 text-center text-xs text-[#65667A]">
              Product Inventory
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
