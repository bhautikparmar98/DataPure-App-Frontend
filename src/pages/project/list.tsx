// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
// sections
import ProjectsComponent from 'src/components/Project/List';

// Guards
import AuthGuard from 'src/guards/AuthGuard';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// UserList.getLayout = function getLayout(page: React.ReactElement) {
//   return <Layout >{page}</Layout>;
// };

// ----------------------------------------------------------------------

export default function UserList() {
  return (
    <Page title="Projects">
      <AuthGuard>
        <ProjectsComponent />
      </AuthGuard>
    </Page>
  );
}
