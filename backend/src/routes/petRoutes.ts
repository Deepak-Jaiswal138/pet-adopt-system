import express from 'express';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
} from '../controllers/petController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getPets).post(protect, admin, createPet);
router
    .route('/:id')
    .get(getPetById)
    .put(protect, admin, updatePet)
    .delete(protect, admin, deletePet);

export default router;
