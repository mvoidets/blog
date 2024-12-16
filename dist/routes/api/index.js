import { Router } from 'express';
import { thoughtsRouter } from './thoughtsRoute.js';
import { userRouter } from './usersRoutes.js';
const router = Router();
router.use('/thoughts', thoughtsRouter);
router.use('/users', userRouter);
export default router;
