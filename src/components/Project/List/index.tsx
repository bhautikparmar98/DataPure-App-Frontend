import { ROLES } from 'src/constants';
import useAuth from 'src/hooks/useAuth';
import Layout from 'src/layouts';
import AdminProjectsComponents from './AdminView';
import ClientProjectsComponent from './ClientView';
import QAProjectsComponents from './QAView';
import SuperAdminProjectsComponents from './SuperAdminView';

const ProjectsComponent = () => {
  const { role } = useAuth();

  if (role === ROLES.SUPER_ADMIN.value)
    return (
      <Layout noHeader noPadding>
        <SuperAdminProjectsComponents />
      </Layout>
    );
  else if (role === ROLES.ADMIN.value)
    return (
      <Layout>
        <AdminProjectsComponents />
      </Layout>
    );
  else if (role === ROLES.QA.value)
    return (
      <Layout>
        <QAProjectsComponents />
      </Layout>
    );
  return (
    <Layout>
      <ClientProjectsComponent />
    </Layout>
  );
};

export default ProjectsComponent;
