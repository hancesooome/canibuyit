import type { ChangeEvent } from "react";

type MoneyInputProps = {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  hint?: string;
  error?: string;
};

export function MoneyInput({
  id,
  label,
  value,
  onChange,
  hint,
  error,
}: MoneyInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const numericValue = event.target.value.replace(/\D/g, "");
    onChange(Number(numericValue));
  }

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className={`money-input ${error ? "invalid" : ""}`}>
        <b>£</b>
        <input
          id={id}
          inputMode="numeric"
          value={value ? value.toLocaleString("en-GB") : ""}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
        />
      </div>
      {hint && <small>{hint}</small>}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
