import { ChangeEvent, useEffect } from 'react';
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
  checks: Checks;
  handleChecks: (checks: Checks) => void;
  handleAllChecks: (allChecked: AllChecked) => void;
};

const useChecks = ({
  classes,
  selectedClassIndex,
  checks,
  handleChecks,
  handleAllChecks,
}: Props) => {
  const toggleOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const newChecks = { ...checks };
    const checked = e.target.checked;
    newChecks[id] = checked;
    handleChecks(newChecks);
  };

  //toggle all checkboxes to be all checked or unchecked
  const toggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    const instancesIds: string[] = classes[selectedClassIndex].annotations.map(
      (anno) => anno.id
    );

    const checksStatus = e.target.checked;

    if (checksStatus === true) {
      handleAllChecks(AllChecked['allChecked']);
      const newChecks: Checks = {};
      instancesIds.forEach((id: string) => {
        newChecks[id] = true;
      });

      handleChecks(newChecks);

      return;
    }

    handleAllChecks(AllChecked['allUnchecked']);
    handleChecks({});
  };

  // test new `checks` state and make changes accordingly
  const shouldChangeAllChecked = () => {
    const annosCount = classes[selectedClassIndex]?.annotations?.length;
    const checkedIds = Object.keys(checks).filter((id: string) => checks[id]);

    if (!annosCount || annosCount === 0) return;

    if (checkedIds.length === 0) {
      handleAllChecks(AllChecked['allUnchecked']);
      return;
    }

    if (checkedIds.length === annosCount) {
      handleAllChecks(AllChecked['allChecked']);
      return;
    }

    handleAllChecks(AllChecked['someChecked']);
  };

  const resetChecks = () => {
    handleChecks({});
    handleAllChecks(AllChecked['allUnchecked']);
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
  };
};

export default useChecks;
