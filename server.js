require('dotenv').config()
const express = require('express')
const mysql = require('mysql2/promise')

const app = express()
app.use(express.json())

// Koneksi ke Azure MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
})

// Test route
app.get('/', (req, res) => {
  res.send("Backend Presensi Jalan 🚀")
})

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() as waktu")
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Endpoint kirim presensi
app.post('/api/presensi', async (req, res) => {
  const { id_pertemuan, nim_mahasiswa, status } = req.body;

  try {
    await pool.query(
      "INSERT INTO presensi (id_pertemuan, nim_mahasiswa, status) VALUES (?, ?, ?)",
      [id_pertemuan, nim_mahasiswa, status || 'hadir']
    );

    res.json({ message: "Presensi berhasil disimpan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000")
})