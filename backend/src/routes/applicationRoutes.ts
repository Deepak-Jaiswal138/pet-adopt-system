import express from 'express';
import {
    applyForPet,
    getMyApplications,
    getApplications,
    updateApplicationStatus,
} from '../controllers/applicationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, applyForPet).get(protect, admin, getApplications);
router.route('/my').get(protect, getMyApplications);
router.route('/:id').put(protect, admin, updateApplicationStatus);

export default router;
