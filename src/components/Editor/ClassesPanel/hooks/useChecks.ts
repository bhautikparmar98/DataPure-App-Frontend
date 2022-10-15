import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  updateFiltersChecks: (checks: Checks) => void;
};

const useChecks = ({
  classes,
  selectedClassIndex,
  updateFiltersChecks,
}: Props) => {
  const [checks, setChecks] = useState<Checks>({});
  const [allChecked, setAllChecked] = useState<AllChecked>(
    AllChecked['allUnchecked']
  );

  useEffect(() => {
    updateFiltersChecks(checks);
  }, [checks]);

  const toggleOne = useCallback(
    (e: ChangeEvent<HTMLInputElement>, id: string) => {
      const newChecks = { ...checks };
      const checked = e.target.checked;
      newChecks[id] = checked;
      setChecks(newChecks);
    },
    [checks]
  );

  //toggle all checkboxes to be all checked or unchecked
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

  // test new `checks` state and make changes accordingly
  const shouldChangeAllChecked = () => {
    const annosCount = classes[selectedClassIndex]?.annotations?.length;
    const checkedIds = Object.keys(checks).filter((id: string) => checks[id]);

    if (!annosCount || annosCount === 0) return;

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

  const resetChecks = () => {
    setChecks({});
    setAllChecked(AllChecked['allUnchecked']);
  };

  useEffect(() => {
    shouldChangeAllChecked();
  }, [checks]);

  //reset checks after selection of new class or deletion for an instance
  useEffect(() => {
    resetChecks();
  }, [selectedClassIndex, classes[selectedClassIndex]?.annotations?.length]);

  return {
    toggleOne,
    toggleAll,
    checks,
    allChecked,
  };
};

export default useChecks;
