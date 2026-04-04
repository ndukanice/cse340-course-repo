import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, getAllUsers } from '../models/users.js';

const userRegistrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 72 })
        .withMessage('Password must be between 8 and 72 characters')
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const showLoginForm = (req, res) => {
    if (req.query.loggedOut === 'true') {
        req.flash('success', 'You have logged out successfully.');
    }

    res.render('login', { title: 'Login' });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    return next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        return next();
    };
};

const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', {
        title: 'Dashboard',
        name,
        email
    });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', {
        title: 'Registered Users',
        users
    });
};

const processUserRegistrationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Login failed. Please check your email and password.');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Login successful!');
        console.log('Authenticated user:', user);
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('Error logging in user:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error logging out user:', error);
            req.flash('error', 'Unable to log out. Please try again.');
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login?loggedOut=true');
    });
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    userRegistrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};
