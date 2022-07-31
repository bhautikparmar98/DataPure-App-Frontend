import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { Container } from '@mui/material';

import { type Mask } from 'src/constants';

type MasksPanelProps = {
  masks: Mask[];
  setSelectedMask: (a: any) => void;
  selectedMaskId: number;
};

const MasksPanel = ({
  masks,
  setSelectedMask,
  selectedMaskId,
}: MasksPanelProps) => (
  <Container sx={{ marginTop: 2 }}>
    <FormControl sx={{ width: 500 }}>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Masks
      </InputLabel>

      <Brightness1Icon
        sx={{
          color: masks[selectedMaskId].color,
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
          <option value={i} key={`mask-opt-${i}`} style={{ color: mask.color }}>
            {mask.title}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  </Container>
);

export default MasksPanel;
