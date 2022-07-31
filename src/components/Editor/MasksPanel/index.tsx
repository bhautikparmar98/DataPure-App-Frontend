import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import useMasks from '../hooks/useMasks';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { Container } from '@mui/material';

const MasksPanel = () => {
  const { setSelectedMask, selectedMaskId, masks } = useMasks();

  return (
    <Container sx={{ marginTop: 2 }}>
      <FormControl sx={{ width: 500 }}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Masks
        </InputLabel>

        <Brightness1Icon
          sx={{
            color: masks[selectedMaskId]?.color,
            marginLeft: 'calc(100% - 20px)',
          }}
        />

        <NativeSelect
          defaultValue={selectedMaskId}
          inputProps={{
            name: 'mask-selection',
            id: 'uncontrolled-native',
          }}
          onChange={setSelectedMask}
        >
          {masks.map((mask, i) => (
            <option
              value={i}
              key={`mask-opt-${i}`}
              style={{ color: mask.color }}
            >
              {mask.title}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Container>
  );
};
export default MasksPanel;
