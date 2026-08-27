import {
  useEffect,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { formatMoney } from "../calculator";

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (newValue: number) => void;
};

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: SliderProps) {
  const [draftValue, setDraftValue] = useState(value.toLocaleString("en-GB"));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value.toLocaleString("en-GB"));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (value > max) {
      onChange(max);
    } else if (value < min) {
      onChange(min);
    }
  }, [value, min, max, onChange]);

  function commitDraftValue() {
    const parsedValue = Number(draftValue.replace(/\D/g, ""));
    const newValue = parsedValue
      ? Math.min(max, Math.max(min, parsedValue))
      : value;

    onChange(newValue);
    setDraftValue(newValue.toLocaleString("en-GB"));
    setIsEditing(false);
  }

  function handleFocus() {
    setIsEditing(true);
    setDraftValue(String(value));
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const numericText = event.target.value.replace(/\D/g, "");
    const parsedValue = Number(numericText);

    if (parsedValue > max) {
      setDraftValue(max.toLocaleString("en-GB"));
      onChange(max);
      return;
    }

    setDraftValue(numericText);
    if (parsedValue >= min) {
      onChange(parsedValue);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  }

  function handleRangeChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <label className="slider">
      <span>
        <b>{label}</b>
        <span className="slider-value-text">
          <span>£</span>
          <input
            className="slider-plain-input"
            aria-label={`${label} exact amount`}
            inputMode="numeric"
            size={draftValue.length || 1}
            value={draftValue}
            onFocus={handleFocus}
            onChange={handleTextChange}
            onBlur={commitDraftValue}
            onKeyDown={handleKeyDown}
          />
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleRangeChange}
      />
      <div>
        <small>{formatMoney(min)}</small>
        <small>{formatMoney(max)}</small>
      </div>
    </label>
  );
}
