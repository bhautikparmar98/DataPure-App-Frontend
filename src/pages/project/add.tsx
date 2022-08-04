// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
// sections

// Guards
import ProjectFormComponent from 'src/components/Project/Form';
import AuthGuard from 'src/guards/AuthGuard';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

AddUser.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AddUser() {
  return (
    <Page title="Add Project">
      <AuthGuard>
        <ProjectFormComponent />
      </AuthGuard>
    </Page>
  );
}
