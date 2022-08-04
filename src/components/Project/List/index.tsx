import useAuth from 'src/hooks/useAuth';
import ClientProjectsComponent from './ClientView';

const ProjectsComponent = () => {
  const { role } = useAuth();
  //TODO: depend on the role display custom view
  return <ClientProjectsComponent />;
};

export default ProjectsComponent;
