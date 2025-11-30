import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('WavePay API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Note: /me is mounted here, so it becomes /api/user/me. Wait, original was /me. Let's check.
// Original: /me -> /me. /api/user/onboard -> /api/user/onboard.
// To keep compatibility:
// app.get('/me', ...) -> handled in userRoutes if mounted at /? No.
// Let's mount userRoutes at /api/user for /onboard, and maybe a separate mount for /me?
// Or just mount everything under /api and change frontend?
// The plan said "Move /me and /api/user/onboard logic here".
// Let's look at userRoutes.ts again.
// router.get('/me', ...); router.post('/onboard', ...);
// If I mount at /api/user, then it's /api/user/me and /api/user/onboard.
// Original was /me.
// I should probably change /me to /api/user/me in frontend to be consistent, or mount specifically.
// Let's mount userRoutes at /api/user and add a redirect or specific route for /me if needed.
// Actually, let's just mount at /api/user and I'll update frontend if needed, OR I can mount /me separately.
// Better:
// app.use('/api/user', userRoutes); -> /api/user/me, /api/user/onboard.
// I'll check frontend usage of /me.
// It's likely used in Auth or Onboarding.
// Let's stick to a clean API structure: /api/user/me.
// I will need to update frontend.

app.use('/api/transactions', transactionRoutes);

export default app;
