import express from 'express';
import cors from 'cors';
import materiRouter from './materi.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

app.get('/api/sehat', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/materi', materiRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
