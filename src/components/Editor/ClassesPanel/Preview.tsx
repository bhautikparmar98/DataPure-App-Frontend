import { useAppSelector } from 'src/redux/store';

const Preview = () => {
  const src = useAppSelector(({ classes }) => classes.src);

  return (
    <div
      style={{
        border: '5px solid yellow',
        background: '#C6C6C6',
      }}
    >
      <img
        src={src}
        alt="workspace preview"
        style={{ height: 150, margin: 'auto' }}
      />
    </div>
  );
};
export default Preview;
