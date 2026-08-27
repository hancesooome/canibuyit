import { Info } from "lucide-react";
import {
  getAffordabilityBand,
  getPositionScore,
  type Band,
} from "../calculator";

const BAND_COLORS: Record<Band, string> = {
  strong: "#16866f",
  good: "#16866f",
  borderline: "#d88b21",
  challenging: "#c64b4b",
};

const BAND_LABELS: Record<Band, string> = {
  strong: "Strong position",
  good: "Good position",
  borderline: "Watch closely",
  challenging: "Higher risk",
};

export function Gauge({ value }: { value: number }) {
  const band = getAffordabilityBand(value);
  const color = BAND_COLORS[band];
  const positionScore = getPositionScore(value);

  return (
    <div
      className="gauge"
      role="img"
      aria-label={`Affordability indicator: required mortgage is ${value.toFixed(1)} times annual household income. ${band} position.`}
    >
      <div className="gauge-visual">
        <svg className="svg-gauge" viewBox="0 0 250 185" aria-hidden="true">
          <path
            className="svg-gauge-track"
            d="M 38.4 160 A 100 100 0 1 1 211.6 160"
            pathLength="100"
          />
          <path
            className="svg-gauge-progress"
            d="M 38.4 160 A 100 100 0 1 1 211.6 160"
            pathLength="100"
            style={{ stroke: color, strokeDasharray: `${positionScore} 100` }}
          />
        </svg>
        <div className="gauge-content" style={{ color }}>
          <small>{BAND_LABELS[band]}</small>
          <strong>{value.toFixed(1)}x</strong>
          <span>
            Required income multiple <Info size={13} />
          </span>
        </div>
      </div>
      <div className="gauge-labels">
        <span>Higher risk</span>
        <span>Watch closely</span>
        <span>Good position</span>
      </div>
    </div>
  );
}
