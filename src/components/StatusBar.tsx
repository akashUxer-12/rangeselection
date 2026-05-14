import type { SelectionState } from "../hooks/useRangeSelection";

interface StatusBarProps {
  state: SelectionState;
  selectedCount: number;
  totalItems: number;
}

export function StatusBar({ state, selectedCount, totalItems }: StatusBarProps) {
  const rangeStr = state.ranges
    .map((r) => (r.start === r.end ? `${r.start}` : `[${r.start}–${r.end}]`))
    .join(" + ");

  return (
    <div className="status-bar">
      <div className="status-row">
        <span className="status-label">Selected</span>
        <span className="status-value">{selectedCount} of {totalItems}</span>
      </div>
      <div className="status-row">
        <span className="status-label">Ranges</span>
        <span className="status-value mono">{rangeStr || "—"}</span>
      </div>
      <div className="status-row">
        <span className="status-label">Focused</span>
        <span className="status-value mono">{state.focusedIndex ?? "—"}</span>
      </div>
      <div className="status-row">
        <span className="status-label">Shift Anchor</span>
        <span className="status-value mono">{state.shiftAnchorIndex ?? "—"}</span>
      </div>
    </div>
  );
}
