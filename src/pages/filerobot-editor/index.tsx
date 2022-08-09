import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../../components/FilerobotEditor'), {
  ssr: false,
});

const ImageEditor = () => (
  <div>
    <Editor />
  </div>
);

export default ImageEditor;
