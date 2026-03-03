import express from 'express';
import {
    getAllInternships,
    getInternship,
    createInternship
} from '../controllers/internship.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAllInternships)
    .post(restrictTo('industry'), createInternship);

router.route('/:id')
    .get(getInternship);

export default router;
