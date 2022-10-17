// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
// sections

// Guards
import AuthGuard from 'src/guards/AuthGuard';
import ProjectDataSetComponent from 'src/components/Project/DataSet';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProjectDataSet.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProjectDataSet() {
  const router = useRouter();
  const query = router.query;

  const id = query.id;

  if (!id) {
    return {
      notFound: true,
    };
  }
  return (
    <Page title='DataSet'>
      <AuthGuard>
        <ProjectDataSetComponent projectId={id} />
      </AuthGuard>
    </Page>
  );
}
