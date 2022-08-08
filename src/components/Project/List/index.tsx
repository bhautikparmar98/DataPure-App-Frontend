import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import Layout from 'src/layouts';
import ClientProjectsComponent from './ClientView';
import SuperAdminProjectsComponents from './SuperAdminView';

const ProjectsComponent = () => {
  const { role } = useAuth();

  if (role === ROLES.SUPER_ADMIN.value)
    return (
      <Layout noHeader noPadding>
        <SuperAdminProjectsComponents />
      </Layout>
    );
  return (
    <Layout>
      <ClientProjectsComponent />
    </Layout>
  );
};

export default ProjectsComponent;
