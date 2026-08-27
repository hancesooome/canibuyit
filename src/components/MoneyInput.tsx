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
    <label className="field my-[17px] block" htmlFor={id}>
      <span className="mb-[7px] block text-[13px] font-bold">{label}</span>
      <div
        className={`money-input flex h-[50px] items-center rounded-[7px] border bg-white px-[14px] focus-within:border-brand focus-within:ring-3 focus-within:ring-[#dbeaff] ${
          error ? "invalid border-[#c64b4b]" : "border-[#cfd8e2]"
        }`}
      >
        <b>£</b>
        <input
          className="w-full border-0 pl-[10px] font-bold text-[#18283e] outline-0"
          id={id}
          inputMode="numeric"
          value={value ? value.toLocaleString("en-GB") : ""}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
        />
      </div>
      {hint && <small className="mt-[5px] block text-[11px] text-[#7b8796]">{hint}</small>}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
