import express from 'express';

import { showHomePage } from './index.js';
import {
	organizationValidation,
	processEditOrganizationForm,
	processNewOrganizationForm,
	showEditOrganizationForm,
	showNewOrganizationForm,
	showOrganizationDetailsPage,
	showOrganizationsPage
} from './organizations.js';
import {
	processEditProjectForm,
	processNewProjectForm,
	processRemoveVolunteerFromProject,
	processVolunteerForProject,
	projectValidation,
	showEditProjectForm,
	showNewProjectForm,
	showProjectDetailsPage,
	showProjectsPage
} from './projects.js';
import {
	categoryValidation,
	processEditCategoryForm,
	processNewCategoryForm,
	processAssignCategoriesForm,
	showEditCategoryForm,
	showAssignCategoriesForm,
	showNewCategoryForm,
	showCategoriesPage,
	showCategoryDetailsPage
} from './categories.js';
import {
	processLoginForm,
	processLogout,
	processUserRegistrationForm,
	requireLogin,
	requireRole,
	showDashboard,
	showLoginForm,
	showUsersPage,
	showUserRegistrationForm,
	userRegistrationValidation
} from './users.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/project/:id/volunteer', requireLogin, processVolunteerForProject);
router.get('/project/:id/remove-volunteer', requireLogin, processRemoveVolunteerFromProject);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
router.get('/project/:projectId/assign-categories', requireRole('admin'), showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireRole('admin'), processAssignCategoriesForm);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.get('/register', showUserRegistrationForm);
router.post('/register', userRegistrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsersPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;