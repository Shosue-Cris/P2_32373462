import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware';
import { Request, Response } from 'express';

const router = Router();


router.get('/', (req: Request, res: Response) => {
  res.render('pages/admin/contactos', );
});

export default router;