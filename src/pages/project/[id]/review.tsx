import { useRouter } from 'next/router';
// layouts
import Layout from 'src/layouts';
// components
import Page from 'src/components/Shared/Page';
// sections
import ProjectDataSetReview from 'src/components/Project/Review';
// Guards
import AuthGuard from 'src/guards/AuthGuard';

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
    <Page title="Review">
      <AuthGuard>
        <ProjectDataSetReview projectId={id} />
      </AuthGuard>
    </Page>
  );
}
