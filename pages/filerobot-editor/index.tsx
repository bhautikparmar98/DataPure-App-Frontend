import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../../components/FilerobotEditor'), {
  ssr: false,
});

const ImageEditor = () => {
  return (
    <div>
      <Editor></Editor>
    </div>
  );
};
export default ImageEditor;
