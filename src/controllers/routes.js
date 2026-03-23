import express from 'express';

import { showHomePage } from './index.js';
import { showOrganizationDetailsPage, showOrganizationsPage } from './organizations.js';
import { showProjectDetailsPage, showProjectsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;