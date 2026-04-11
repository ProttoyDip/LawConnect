const express = require('express');
const {
	registerAuthUser,
	loginUser,
	getCurrentUser,
	logoutUser,
	getCrimeReports,
	getAdminAnalytics,
	getAdminUsers,
	createAdminUser,
	deleteAdminUser,
	getOfficers,
	getNotifications,
	markNotificationRead,
	markAllNotificationsRead,
	getInvestigatorStats,
	getInvestigatorCases,
	getInvestigatorCase,
	registerUser,
	getUsers,
	getMyReports,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/auth/register', registerAuthUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', getCurrentUser);
router.post('/auth/logout', logoutUser);
router.get('/my-reports', getMyReports);
router.get('/crime-reports', getCrimeReports);
router.get('/admin/analytics', getAdminAnalytics);
router.get('/admin/users', getAdminUsers);
router.post('/admin/users', createAdminUser);
router.delete('/admin/users/:user', deleteAdminUser);
router.get('/officers', getOfficers);
router.get('/notifications', getNotifications);
router.put('/notifications/:notification/read', markNotificationRead);
router.put('/notifications/read-all', markAllNotificationsRead);
router.get('/investigator/stats', getInvestigatorStats);
router.get('/investigator/cases', getInvestigatorCases);
router.get('/investigator/cases/:caseId', getInvestigatorCase);

router.post('/register', registerUser);
router.get('/users', getUsers);

module.exports = router;
