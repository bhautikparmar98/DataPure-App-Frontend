import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/redux/store';

const Preview = () => {
  const { preview } = useAppSelector(({ editor }) => editor) || '';

  const [src, setSrc] = useState<string>(preview);

  useEffect(() => {
    setSrc(preview);
  }, [preview]);

  return (
    <div style={{ border: '5px solid yellow', background: '#C6C6C6' }}>
      {src.length > 0 ? (
        <img src={src} alt="workspace preview" />
      ) : (
        <div style={{ width: '100%', background: '#fff', height: 150 }} />
      )}
    </div>
  );
};
export default Preview;
