
import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(
            path.join(process.cwd(), "ca.pem"),
            "utf8"
        ),
        rejectUnauthorized: true,
    },

    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;
