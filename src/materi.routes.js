import { Router } from 'express';
import { ambilSemuaMateri, buatMateri } from './materi.repository.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await ambilSemuaMateri();
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
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

    const tersimpan = await buatMateri({
      judul: judulBersih,
      mata_kuliah: mkBersih,
      pertemuan: pertemuanAngka,
      tautan: tautanBersih,
    });

    return res.status(201).json(tersimpan);
  } catch (err) {
    return next(err);
  }
});

export default router;
