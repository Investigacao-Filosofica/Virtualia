import { Router } from 'express';
import { addCertificate, createOrUpdateUser, getUserByWallet } from '../controllers/userController.js';

const router = Router();

router.post('/', createOrUpdateUser);
router.get('/:walletAddress', getUserByWallet);
router.post('/:walletAddress/certificates', addCertificate);

export default router;
