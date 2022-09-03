import { useState, ChangeEvent, useEffect } from 'react';
import { Class } from 'src/constants';

interface Checks {
  [instanceId: string]: boolean;
}

enum AllChecked {
  'allUnchecked',
  'someChecked',
  'allChecked',
}

type Props = {
  selectedClassIndex: number;
  classes: Class[];
};

const useActions = ({ classes, selectedClassIndex }: Props) => {
  const [checks, setChecks] = useState<Checks>({});

  const [allChecked, setAllChecked] = useState<AllChecked>(
    AllChecked['allUnchecked']
  );

  const toggleOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const newChecks = { ...checks };
    const checked = e.target.checked;
    newChecks[id] = checked;
    setChecks(newChecks);
  };

  //toggle all checkboxes
  const toggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    const instancesIds: string[] = classes[selectedClassIndex].annotations.map(
      (anno) => anno.id
    );

    const checksStatus = e.target.checked;

    if (checksStatus === true) {
      setAllChecked(AllChecked['allChecked']);
      const newChecks: Checks = {};
      instancesIds.forEach((id: string) => {
        newChecks[id] = true;
      });

      setChecks(newChecks);

      return;
    }

    setAllChecked(AllChecked['allUnchecked']);
    setChecks({});
  };

  const shouldChangeAllChecked = () => {
    const annosCount = classes[selectedClassIndex].annotations.length;
    const checkedIds = Object.keys(checks).filter((id: string) => checks[id]);

    if (checkedIds.length === 0) {
      setAllChecked(AllChecked['allUnchecked']);
      return;
    }

    if (checkedIds.length === annosCount) {
      setAllChecked(AllChecked['allChecked']);
      return;
    }

    setAllChecked(AllChecked['someChecked']);
  };

  useEffect(() => {
    shouldChangeAllChecked();
  }, [checks]);

  // reset checks when class changes
  useEffect(() => {
    setChecks({});
    setAllChecked(AllChecked['allChecked']);
  }, [selectedClassIndex]);

  return {
    checks,
    allChecked,
    toggleOne,
    toggleAll,
  };
};

export default useActions;
