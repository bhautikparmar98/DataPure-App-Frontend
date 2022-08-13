import { useAppSelector } from 'src/redux/store';

const Preview = () => {
  const url = useAppSelector(({ editor }) => editor.url);

  // const [src, setSrc] = useState<string>(preview);

  // useEffect(() => {
  //   setSrc(preview);
  // }, [preview]);

  return (
    <div style={{ border: '5px solid yellow', background: '#C6C6C6' }}>
      <img src={url} alt="workspace preview" style={{ minHeight: 150 }} />
    </div>
  );
};
export default Preview;
