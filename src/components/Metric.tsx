type MetricProps = {
  label: string;
  value: string;
  note?: string;
};

export function Metric({ label, value, note }: MetricProps) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
