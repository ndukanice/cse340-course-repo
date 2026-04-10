import db from './db.js';

let volunteerTableEnsured = false;

const ensureVolunteerTableExists = async () => {
    if (volunteerTableEnsured) {
        return;
    }

    const query = `
        CREATE TABLE IF NOT EXISTS public.project_volunteer (
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (project_id, user_id),
            CONSTRAINT fk_project_volunteer_project
                FOREIGN KEY (project_id)
                REFERENCES public.project (project_id)
                ON DELETE CASCADE,
            CONSTRAINT fk_project_volunteer_user
                FOREIGN KEY (user_id)
                REFERENCES public.users (user_id)
                ON DELETE CASCADE
        );
    `;

    await db.query(query);
    volunteerTableEnsured = true;
};

const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id, 
            p.title, 
            p.description, 
            p.location, 
            p.date,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        ORDER BY p.date DESC;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const query_params = [number_of_projects];
    const result = await db.query(query, query_params);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const query_params = [id];
    const result = await db.query(query, query_params);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByOrganizationId = async (organizationId) => {
        const query = `
                SELECT
                    project_id,
                    organization_id,
                    title,
                    description,
                    location,
                    date
                FROM project
                WHERE organization_id = $1
                ORDER BY date;
            `;

        const query_params = [organizationId];
        const result = await db.query(query, query_params);

        return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE project
        SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const query_params = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }

    return result.rows[0].project_id;
};

const addVolunteerToProject = async (projectId, userId) => {
    await ensureVolunteerTableExists();

    const query = `
        INSERT INTO public.project_volunteer (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING;
    `;

    const query_params = [projectId, userId];
    await db.query(query, query_params);
};

const removeVolunteerFromProject = async (projectId, userId) => {
    await ensureVolunteerTableExists();

    const query = `
        DELETE FROM public.project_volunteer
        WHERE project_id = $1
        AND user_id = $2;
    `;

    const query_params = [projectId, userId];
    await db.query(query, query_params);
};

const isUserVolunteeringForProject = async (projectId, userId) => {
    await ensureVolunteerTableExists();

    const query = `
        SELECT 1
        FROM public.project_volunteer
        WHERE project_id = $1
        AND user_id = $2;
    `;

    const query_params = [projectId, userId];
    const result = await db.query(query, query_params);

    return result.rows.length > 0;
};

const getVolunteeredProjectsByUserId = async (userId) => {
    await ensureVolunteerTableExists();

    const query = `
        SELECT
            p.project_id,
            p.title,
            p.date,
            p.location,
            o.name AS organization_name
        FROM public.project_volunteer pv
        JOIN public.project p ON pv.project_id = p.project_id
        JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.date ASC, p.title ASC;
    `;

    const query_params = [userId];
    const result = await db.query(query, query_params);

    return result.rows;
};

// Export the model functions
export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    addVolunteerToProject,
    removeVolunteerFromProject,
    isUserVolunteeringForProject,
    getVolunteeredProjectsByUserId
};
