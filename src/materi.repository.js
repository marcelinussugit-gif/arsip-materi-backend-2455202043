import pool from './db.js';

export async function ambilSemuaMateri() {
  const [rows] = await pool.query(
    'SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi ORDER BY id ASC'
  );
  return rows;
}

export async function ambilMateriById(id) {
  const [rows] = await pool.query(
    'SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi WHERE id = ?',
    [id]
  );
  return rows[0] ?? null;
}

export async function buatMateri({ judul, mata_kuliah, pertemuan, tautan }) {
  const [result] = await pool.query(
    'INSERT INTO materi (judul, mata_kuliah, pertemuan, tautan) VALUES (?, ?, ?, ?)',
    [judul, mata_kuliah, pertemuan, tautan]
  );
  return ambilMateriById(result.insertId);
}
