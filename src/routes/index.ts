import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import profileRoutes from './profile';

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from API' });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);

export default router;