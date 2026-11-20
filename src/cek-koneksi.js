import pool from './db.js';

try {
  const [rows] = await pool.query('SELECT VERSION() AS versi, DATABASE() AS db, USER() AS pengguna');
  console.log(rows[0]);
} catch (err) {
  console.error('Gagal koneksi:', err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
