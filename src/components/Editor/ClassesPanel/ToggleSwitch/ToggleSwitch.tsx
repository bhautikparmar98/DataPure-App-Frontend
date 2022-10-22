import { ChangeEvent } from 'react';
import styles from './toggleswitch.module.css';

interface SwitchProps {
  onChangeHandler: (value: string) => void;
  value: String;
}

const ToggleSwitch = ({ onChangeHandler, value }: SwitchProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.switches_container}>
        <input
          type="radio"
          id="switchAnnotation"
          name="switchPlan"
          value="Annotation"
          checked={value === 'Annotation' ? true : false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e.target.value)}
        />
        <input
          type="radio"
          id="switchMetadata"
          value="Metadata"
          name="switchPlan"
          checked={value === 'Metadata' ? true : false}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e.target.value)}
        />
        <label htmlFor="switchAnnotation">Annotation</label>
        <label htmlFor="switchMetadata">Metadata</label>
        <div className={styles.switch_wrapper}>
          <div className={styles.switch}>
            <div>Annotation</div>
            <div>Metadata</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
