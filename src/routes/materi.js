import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi ORDER BY id ASC'
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('GET /api/materi error:', err);
    res.status(500).json({ error: 'Gagal mengambil data materi' });
  }
});

router.post('/', async (req, res) => {
  const { judul, mata_kuliah, pertemuan, tautan } = req.body ?? {};

  const judulBersih = typeof judul === 'string' ? judul.trim() : '';
  const mkBersih = typeof mata_kuliah === 'string' ? mata_kuliah.trim() : '';
  const pertemuanAngka = Number(pertemuan);
  const tautanBersih =
    tautan === undefined || tautan === null || String(tautan).trim() === ''
      ? null
      : String(tautan).trim();

  if (!judulBersih || judulBersih.length > 100) {
    return res.status(400).json({
      error: 'Judul wajib diisi dan maksimal 100 karakter',
    });
  }

  if (!mkBersih || mkBersih.length > 100) {
    return res.status(400).json({
      error: 'Mata kuliah wajib diisi dan maksimal 100 karakter',
    });
  }

  if (!Number.isInteger(pertemuanAngka) || pertemuanAngka < 1 || pertemuanAngka > 16) {
    return res.status(400).json({
      error: 'Pertemuan harus berupa bilangan bulat antara 1 sampai 16',
    });
  }

  if (tautanBersih !== null && tautanBersih.length > 255) {
    return res.status(400).json({
      error: 'Tautan maksimal 255 karakter',
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO materi (judul, mata_kuliah, pertemuan, tautan) VALUES (?, ?, ?, ?)',
      [judulBersih, mkBersih, pertemuanAngka, tautanBersih]
    );

    const [rows] = await pool.query(
      'SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /api/materi error:', err);
    res.status(500).json({ error: 'Gagal menyimpan data materi' });
  }
});

export default router;
