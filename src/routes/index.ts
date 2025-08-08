import { Router, Request, Response } from 'express';
import authRoutes from './auth';

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from API' });
});

router.use('/auth', authRoutes);

export default router;