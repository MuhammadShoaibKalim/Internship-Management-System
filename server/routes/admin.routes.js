import express from 'express';
import {
    getAdminStats,
    getAllUsers,
    updateUserStatus,
    verifyIndustry,
    getDepartmentStats,
    getGlobalReports,
    getSystemSettings,
    updateSystemSetting,
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes here are PROTECTED and restricted to ADMIN
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUserStatus);
router.patch('/verify-industry/:id', verifyIndustry);
router.get('/reports', getGlobalReports);

// Settings
router.get('/settings', getSystemSettings);
router.patch('/settings', updateSystemSetting);

// Departments
router.route('/departments')
    .get(getAllDepartments)
    .post(createDepartment);

router.route('/departments/:id')
    .patch(updateDepartment)
    .delete(deleteDepartment);

export default router;
