import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('src/components/Editor'), { ssr: false });

const Index = () => {
  return <Editor />;
};
export default Index;
