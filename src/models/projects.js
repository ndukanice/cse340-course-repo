import db from './db.js';

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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };
