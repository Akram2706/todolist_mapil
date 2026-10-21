
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM products");

    return Response.json({
      success: true,
      message: "Koneksi database berhasil!",
      data: rows,
    });
  } catch (error) {
    console.error("Database error:", error);

    return Response.json(
      {
        success: false,
        message: "Koneksi database gagal. Periksa terminal VS Code.",
      },
      { status: 500 }
    );
  }
}
