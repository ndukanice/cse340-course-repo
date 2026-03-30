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
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;