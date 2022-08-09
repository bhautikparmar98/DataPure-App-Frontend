import { Container } from '@mui/material';
import Preview from './Preview';
import Filters from './Filters';
import Annotations from './Annotations';
import { useAppSelector } from 'src/redux/store';

const LayersPanel = () => {
  const { layers, selectedLayerId } = useAppSelector(({ layers }) => layers);

  return (
    <Container
      sx={{
        width: 300,
        paddingTop: 2,
        backgroundColor: '#F6F6F6',
        minHeight: '100vh',
      }}
    >
      <Preview />
      <Filters selectedLayerId={selectedLayerId} layers={layers} />
      <Annotations />
      {/* <FormControl sx={{ width: '100%', margin: 0 }}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Classes
        </InputLabel>

        <Brightness1Icon
          sx={{
            color: layers[selectedLayerId]?.color,
            marginLeft: 'calc(100% - 20px)',
          }}
        /> */}

      {/* <NativeSelect
          defaultValue={selectedLayerId}
          inputProps={{
            name: 'layer-selection',
            id: 'uncontrolled-native',
          }}
          onChange={setSelectedLayer}
        >
          {layers.map((layer, i) => (
            <option
              value={i}
              key={`layer-opt-${i}`}
              style={{ color: layer.color }}
            >
              {layer.title}
            </option>
          ))}
        </NativeSelect> */}
      {/* </FormControl> */}
    </Container>
  );
};
export default LayersPanel;
