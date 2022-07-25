import dynamic from 'next/dynamic';

const Annotator = dynamic(() => import('../../components/Annotator'), {
  ssr: false,
});

const OCR = ({ imgSrc }: { imgSrc: string }) => <Annotator imgSrc={imgSrc} />;

export default OCR;
