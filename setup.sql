DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.roles;
DROP TABLE IF EXISTS public.project_category;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.organization;

CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES public.organization (organization_id)
);

CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_roles
        FOREIGN KEY (role_id)
        REFERENCES public.roles (role_id)
);

CREATE TABLE public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES public.project (project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES public.category (category_id)
        ON DELETE CASCADE
);

INSERT INTO public.organization (organization_id, name, description, contact_email, logo_filename) VALUES
    (1, 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    (2, 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    (3, 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

INSERT INTO public.project (project_id, organization_id, title, description, location, date) VALUES
    (1, 1, 'Community Center Renovation', 'Renovate the local community center with sustainable materials', 'Downtown', '2026-04-15'),
    (2, 1, 'School Library Expansion', 'Expand the library section at Lincoln High School', 'Lincoln High School', '2026-05-10'),
    (3, 1, 'Playground Construction', 'Build a new accessible playground for children', 'Central Park', '2026-06-01'),
    (4, 1, 'Bridge Repair Project', 'Repair and reinforce the pedestrian bridge', 'Riverside District', '2026-07-20'),
    (5, 1, 'Community Garden Build', 'Create raised garden beds for the neighborhood', 'Maple Street', '2026-08-15'),
    (6, 2, 'Urban Rooftop Garden', 'Convert rooftop space into productive garden', 'Downtown Tech Building', '2026-04-01'),
    (7, 2, 'School Nutrition Program', 'Establish organic garden at elementary school for fresh produce', 'Roosevelt Elementary', '2026-05-15'),
    (8, 2, 'Community Composting Initiative', 'Set up composting stations throughout the neighborhood', 'Five neighborhoods', '2026-06-10'),
    (9, 2, 'Pollinator Garden Creation', 'Plant native flowers to support bees and butterflies', 'Botanical Park', '2026-07-05'),
    (10, 2, 'Food Forest Development', 'Plant fruit and nut trees for community harvest', 'Heritage Park', '2026-08-20'),
    (11, 3, 'Senior Care Outreach', 'Organize activities and care visits for elderly residents', 'City Care Facility', '2026-04-20'),
    (12, 3, 'Youth Mentorship Program', 'Launch mentorship initiative for at-risk youth', 'Community Center', '2026-05-05'),
    (13, 3, 'Food Bank Supply Drive', 'Collect and distribute food to families in need', 'Multiple locations', '2026-06-15'),
    (14, 3, 'Disaster Relief Coordination', 'Organize volunteers for emergency response', 'City Hall', '2026-07-30'),
    (15, 3, 'Education Tutoring Initiative', 'Provide free tutoring for students after school', 'Public Library', '2026-08-10');

INSERT INTO public.category (category_id, name) VALUES
    (1, 'Community Support'),
    (2, 'Education'),
    (3, 'Environment'),
    (4, 'Food Security'),
    (5, 'Infrastructure');

INSERT INTO public.roles (role_id, role_name, role_description) VALUES
    (1, 'user', 'Standard user with basic access'),
    (2, 'admin', 'Administrator with full system access');

INSERT INTO public.project_category (project_id, category_id) VALUES
    (1, 1), (1, 5),
    (2, 2), (2, 5),
    (3, 1), (3, 5),
    (4, 5),
    (5, 3), (5, 4),
    (6, 3), (6, 4),
    (7, 2), (7, 4),
    (8, 3),
    (9, 3),
    (10, 3), (10, 4),
    (11, 1),
    (12, 1), (12, 2),
    (13, 1), (13, 4),
    (14, 1),
    (15, 1), (15, 2);

SELECT setval(pg_get_serial_sequence('public.organization', 'organization_id'), (SELECT MAX(organization_id) FROM public.organization));
SELECT setval(pg_get_serial_sequence('public.project', 'project_id'), (SELECT MAX(project_id) FROM public.project));
SELECT setval(pg_get_serial_sequence('public.category', 'category_id'), (SELECT MAX(category_id) FROM public.category));
SELECT setval(pg_get_serial_sequence('public.roles', 'role_id'), (SELECT MAX(role_id) FROM public.roles));

-- Verification SQL for roles/users relationship (run manually when needed):
-- SELECT * FROM public.roles;
--
-- INSERT INTO public.users (name, email, password_hash, role_id)
-- VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);
--
-- SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
-- FROM public.users u
-- JOIN public.roles r ON u.role_id = r.role_id;
--
-- DELETE FROM public.users WHERE email = 'test@example.com';