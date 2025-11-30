import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import { authenticate } from './middleware/auth.js';

app.get('/', (req: Request, res: Response) => {
    res.send('WavePay API is running');
});

app.get('/me', authenticate, (req: Request, res: Response) => {
    res.json({ user: req.user });
});

app.post('/api/auth/verify', authenticate, (req: Request, res: Response) => {
    res.json({ success: true, user: req.user });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
