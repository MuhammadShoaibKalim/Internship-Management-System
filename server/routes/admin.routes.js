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
    deleteDepartment,
    deleteUser,
    createSubAdmin,
    globalSearch
} from '../controllers/admin.controller.js';
import { protect, restrictTo, restrictPermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes here are PROTECTED and restricted to ADMIN
router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/search', globalSearch);
router.get('/users', getAllUsers);
router.route('/users/:id')
    .patch(restrictPermission('manage_users'), updateUserStatus)
    .delete(restrictPermission('manage_users'), deleteUser);

router.post('/users/create-admin', restrictPermission('all'), createSubAdmin);
router.patch('/verify-industry/:id', restrictPermission('approve_only'), verifyIndustry);
router.get('/reports', restrictPermission('read_only'), getGlobalReports);

// Settings
router.get('/settings', restrictPermission('read_only'), getSystemSettings);
router.patch('/settings', restrictPermission('all'), updateSystemSetting);

router.get('/departments/stats', restrictPermission('read_only', 'manage_departments'), getDepartmentStats);
router.route('/departments')
    .get(restrictPermission('read_only', 'manage_departments'), getAllDepartments)
    .post(restrictPermission('manage_departments'), createDepartment);

router.route('/departments/:id')
    .patch(restrictPermission('manage_departments'), updateDepartment)
    .delete(restrictPermission('manage_departments'), deleteDepartment);

export default router;
