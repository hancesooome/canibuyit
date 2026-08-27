type MetricProps = {
  label: string;
  value: string;
  note?: string;
};

export function Metric({ label, value, note }: MetricProps) {
  return (
    <div className="metric flex flex-col">
      <span className="text-xs font-semibold text-[#697689]">{label}</span>
      <strong className="my-[7px] font-display text-[23px] font-extrabold tabular-nums">
        {value}
      </strong>
      {note && <small className="text-[10px] text-[#8a95a3]">{note}</small>}
    </div>
  );
}
