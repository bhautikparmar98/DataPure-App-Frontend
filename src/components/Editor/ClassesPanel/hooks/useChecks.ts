import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Class } from 'src/constants';
import { setChecks } from 'src/redux/slices/classes/classes.slice';
import { RootState } from 'src/redux/store';

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

  const [allChecked, setAllChecked] = useState<AllChecked>(
    AllChecked['allUnchecked']
  );
  const multiselectAnnotators = useSelector((state: RootState) => state.classes.multiselectedAnnotators);
  const checks = useSelector((state: RootState) => state.classes.checks);
  const dispatch = useDispatch()

  const multiSelectChecks : Checks = {};
  
  multiselectAnnotators.forEach((anno:any)=> {
    multiSelectChecks[anno.id] = true
  });


  useEffect(()=>{
     const newChecks = multiSelectChecks
     dispatch(setChecks({newChecks}))
  },[JSON.stringify(multiSelectChecks)])

  

  const toggleOne = useCallback(
    (e: ChangeEvent<HTMLInputElement>, id: string) => {
      const newChecks = { ...checks };
      const checked = e.target.checked;
      newChecks[id] = checked;
      dispatch(setChecks({newChecks}))
    },
    [JSON.stringify(checks)]
  );

  //toggle all checkboxes to be all checked or unchecked
  const toggleAll = (e: ChangeEvent<HTMLInputElement>) => {
    const instancesIds: string[] = classes[selectedClassIndex].annotations.map(
      (anno) => anno.id
    );

    const checksStatus = e.target.checked;
    const newChecks: Checks = {};

    if (checksStatus === true) {
      setAllChecked(AllChecked['allChecked']);
      instancesIds.forEach((id: string) => {
        newChecks[id] = true;
      });
      dispatch(setChecks({newChecks}))

      return;
    }

    setAllChecked(AllChecked['allUnchecked']);
    dispatch(setChecks({newChecks}));
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
    const newChecks: Checks = {};
    dispatch(setChecks({newChecks}));
    setAllChecked(AllChecked['allUnchecked']);
  };

  useEffect(() => {
    shouldChangeAllChecked();
  }, [checks]);

  //reset checks after selection of new class or deletion for an instance
  useEffect(() => {
    if(JSON.stringify(checks) === '{}') resetChecks();
  }, [selectedClassIndex, classes[selectedClassIndex]?.annotations?.length]);

  return {
    toggleOne,
    toggleAll,
    checks,
    allChecked,
  };
};

export default useChecks;


