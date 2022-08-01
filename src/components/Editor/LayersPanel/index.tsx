import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import useLayers from '../hooks/useLayers';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { Container } from '@mui/material';

const LayersPanel = () => {
  const { setSelectedLayer, selectedLayerId, layers } = useLayers();

  return (
    <Container sx={{ marginTop: 2 }}>
      <FormControl sx={{ width: 500 }}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Classes
        </InputLabel>

        <Brightness1Icon
          sx={{
            color: layers[selectedLayerId]?.color,
            marginLeft: 'calc(100% - 20px)',
          }}
        />

        <NativeSelect
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
        </NativeSelect>
      </FormControl>
    </Container>
  );
};
export default LayersPanel;
