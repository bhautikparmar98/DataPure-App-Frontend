import dynamic from 'next/dynamic';

const Annotator = dynamic(() => import('../../components/Annotator'), {
  ssr: false,
});

const OCR = ({ img }: { img: File }) => <Annotator img={img} />;

export default OCR;
