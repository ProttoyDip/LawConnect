const express = require('express');
const {
	registerAuthUser,
	loginUser,
	getCurrentUser,
	logoutUser,
	registerUser,
	getUsers,
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/auth/register', registerAuthUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', getCurrentUser);
router.post('/auth/logout', logoutUser);

router.post('/register', registerUser);
router.get('/users', getUsers);

module.exports = router;
