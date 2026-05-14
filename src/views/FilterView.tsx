import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const FILTERS = [
  { label: "United States", count: 2841 },
  { label: "United Kingdom", count: 1205 },
  { label: "Germany", count: 982 },
  { label: "France", count: 876 },
  { label: "Canada", count: 743 },
  { label: "Australia", count: 691 },
  { label: "Japan", count: 634 },
  { label: "India", count: 589 },
  { label: "Brazil", count: 512 },
  { label: "Netherlands", count: 478 },
  { label: "Sweden", count: 423 },
  { label: "Singapore", count: 387 },
  { label: "South Korea", count: 356 },
  { label: "Italy", count: 334 },
  { label: "Spain", count: 312 },
  { label: "Mexico", count: 289 },
  { label: "Switzerland", count: 267 },
  { label: "Norway", count: 245 },
  { label: "Denmark", count: 223 },
  { label: "Ireland", count: 198 },
  { label: "New Zealand", count: 176 },
  { label: "Portugal", count: 154 },
  { label: "Belgium", count: 143 },
  { label: "Austria", count: 132 },
  { label: "Finland", count: 121 },
  { label: "Poland", count: 108 },
  { label: "Israel", count: 97 },
  { label: "Czech Republic", count: 86 },
  { label: "Argentina", count: 74 },
  { label: "Chile", count: 63 },
];

const TOTAL = FILTERS.length;

export function FilterView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection, selectAll } =
    useRangeSelection({ totalItems: TOTAL, clickMode: "toggle" });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.focus();
    const handler = (e: KeyboardEvent) => handleKeyDown(e);
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [handleKeyDown]);

  useEffect(() => {
    if (state.focusedIndex == null) return;
    const rows = containerRef.current?.querySelectorAll(".filter-item");
    (rows?.[state.focusedIndex] as HTMLElement)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.focusedIndex]);

  const allSelected = getSelectedCount() === TOTAL;
  const selectedTotal = FILTERS.reduce(
    (sum, f, i) => (isSelected(i) ? sum + f.count : sum),
    0
  );

  return (
    <div className="view-section">
      <div className="view-sticky-toolbar">
        <div className="view-header">
          <h3>Vertical Filter</h3>
          <span className="view-hint">Flat checkbox list. Click to toggle, Shift for range. Like sidebar filters.</span>
          <button className="btn-clear" onClick={clearSelection}>Clear</button>
        </div>
        <KeyboardHints />
        <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      </div>

      <div className="filter-layout">
        <div className="filter-panel" ref={containerRef} tabIndex={0}>
          <div className="filter-panel-header">
            <div className="filter-panel-title">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? clearSelection() : selectAll())}
              />
              <span>Country</span>
            </div>
            <span className="filter-panel-count">{getSelectedCount()} of {TOTAL}</span>
          </div>

          <div className="filter-list">
            {FILTERS.map((filter, i) => (
              <div
                key={i}
                className={[
                  "filter-item",
                  isSelected(i) ? "selected" : "",
                  isFocused(i) ? "focused" : "",
                ].join(" ")}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleItemInteraction(i, e);
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected(i)}
                  readOnly
                  tabIndex={-1}
                  className="filter-checkbox"
                />
                <span className="filter-label">{filter.label}</span>
                <span className="filter-count">{filter.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="filter-preview">
          <div className="filter-preview-header">
            <h4>Applied Filters</h4>
            {getSelectedCount() > 0 && (
              <span className="filter-preview-stat">{selectedTotal.toLocaleString()} total results</span>
            )}
          </div>
          {getSelectedCount() === 0 ? (
            <p className="filter-preview-empty">No filters selected. Click items on the left or use keyboard to select.</p>
          ) : (
            <div className="filter-preview-tags">
              {FILTERS.map((f, i) =>
                isSelected(i) ? (
                  <span key={i} className="filter-preview-tag">
                    {f.label}
                    <span className="filter-preview-tag-count">{f.count.toLocaleString()}</span>
                  </span>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
