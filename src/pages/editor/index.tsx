import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('src/components/Editor'), { ssr: false });

const Index = () => <Editor />;
export default Index;
