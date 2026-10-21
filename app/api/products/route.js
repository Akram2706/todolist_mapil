import { pool } from "@/lib/db";


export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        return Response.json(rows);
    } catch (error) {
        console.error("GET products error:", error);
        return Response.json(
            { message: "Gagal mengambil data produk" },
            { status: 500 }
        );
    }
}

// CREATE: menambahkan produk
export async function POST(request) {
    try {
        const body = await request.json();
        const { nama_produk, harga, stok } = body;

        if (
            typeof nama_produk !== "string" ||
            !nama_produk.trim() ||
            !Number.isFinite(Number(harga)) ||
            Number(harga) < 0 ||
            !Number.isInteger(Number(stok)) ||
            Number(stok) < 0
        ) {
            return Response.json(
                { message: "Data produk tidak valid" },
                { status: 400 }
            );
        }

        const [result] = await pool.execute(
            "INSERT INTO products (nama_produk, harga, stok) VALUES (?, ?, ?)",
            [nama_produk.trim(), Number(harga), Number(stok)]
        );

        return Response.json(
            {
                message: "Produk berhasil ditambahkan",
                id: result.insertId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST products error:", error);
        return Response.json(
            { message: "Gagal menambahkan produk" },
            { status: 500 }
        );
    }
}

// UPDATE: mengubah produk berdasarkan ID
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, nama_produk, harga, stok } = body;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) < 1 ||
            typeof nama_produk !== "string" ||
            !nama_produk.trim() ||
            !Number.isFinite(Number(harga)) ||
            Number(harga) < 0 ||
            !Number.isInteger(Number(stok)) ||
            Number(stok) < 0
        ) {
            return Response.json(
                { message: "Data produk tidak valid" },
                { status: 400 }
            );
        }

        const [result] = await pool.execute(
            "UPDATE products SET nama_produk = ?, harga = ?, stok = ? WHERE id = ?",
            [nama_produk.trim(), Number(harga), Number(stok), Number(id)]
        );

        if (result.affectedRows === 0) {
            return Response.json(
                { message: "Produk tidak ditemukan atau tidak ada perubahan" },
                { status: 404 }
            );
        }

        return Response.json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
        console.error("PUT products error:", error);
        return Response.json(
            { message: "Gagal memperbarui produk" },
            { status: 500 }
        );
    }
}

// DELETE: menghapus produk berdasarkan ID
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
            return Response.json(
                { message: "ID produk tidak valid" },
                { status: 400 }
            );
        }

        const [result] = await pool.execute(
            "DELETE FROM products WHERE id = ?",
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return Response.json(
                { message: "Produk tidak ditemukan" },
                { status: 404 }
            );
        }

        return Response.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        console.error("DELETE products error:", error);
        return Response.json(
            { message: "Gagal menghapus produk" },
            { status: 500 }
        );
    }
}
