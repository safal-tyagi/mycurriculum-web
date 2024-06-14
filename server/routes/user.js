import express from 'express';
import { getUser, updateUser } from '../controllers/user.js';
import passport from 'passport';

const router = express.Router();

// Protect routes using passport JWT strategy
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', getUser);
router.put('/', updateUser);

export default router;
