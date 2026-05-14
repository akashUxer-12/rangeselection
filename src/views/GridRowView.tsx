import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const TOTAL = 25;

const DATA = Array.from({ length: TOTAL }, (_, i) => ({
  id: `PRD-${1000 + i}`,
  task: [
    "Setup CI/CD pipeline", "Write unit tests", "Design login page",
    "Implement auth flow", "Create API endpoints", "Add validation",
    "Deploy to staging", "Code review", "Write documentation",
    "Performance audit", "Fix accessibility", "Update dependencies",
    "Add error handling", "Create dashboards", "Migrate database",
    "Setup monitoring", "Add search feature", "Optimize queries",
    "Build onboarding", "Create user roles", "Add notifications",
    "Refactor models", "Setup caching", "Add export feature",
    "Create reports",
  ][i],
  assignee: ["Alice", "Bob", "Carol", "Dave", "Eve"][i % 5],
  status: ["To Do", "In Progress", "Review", "Done", "Blocked"][i % 5],
  priority: ["Critical", "High", "Medium", "Low"][i % 4],
  points: [1, 2, 3, 5, 8, 13][i % 6],
}));

const STATUS_COLORS: Record<string, string> = {
  "To Do": "#6b7280",
  "In Progress": "#3b82f6",
  Review: "#f59e0b",
  Done: "#10b981",
  Blocked: "#ef4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#6b7280",
};

export function GridRowView() {
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
    const rows = containerRef.current?.querySelectorAll(".grid-row");
    (rows?.[state.focusedIndex] as HTMLElement)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.focusedIndex]);

  const allSelected = getSelectedCount() === TOTAL;

  return (
    <div className="view-section">
      <div className="view-sticky-toolbar">
        <div className="view-header">
          <h3>Grid Rows — With Checkbox</h3>
          <span className="view-hint">Click = toggle row. Shift = range. Toggle mode with checkboxes.</span>
          <button className="btn-clear" onClick={clearSelection}>Clear</button>
        </div>
        <KeyboardHints />
        <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      </div>
      <div className="grid-container" ref={containerRef} tabIndex={0}>
        <div className="grid-header">
          <div className="grid-cell checkbox-cell">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? clearSelection() : selectAll())}
            />
          </div>
          <div className="grid-cell id-cell">ID</div>
          <div className="grid-cell task-cell">Task</div>
          <div className="grid-cell">Assignee</div>
          <div className="grid-cell">Status</div>
          <div className="grid-cell">Priority</div>
          <div className="grid-cell num-cell">Points</div>
        </div>
        {DATA.map((row, i) => (
          <div
            key={i}
            className={[
              "grid-row",
              isSelected(i) ? "selected" : "",
              isFocused(i) ? "focused" : "",
            ].join(" ")}
            onMouseDown={(e) => {
              e.preventDefault();
              handleItemInteraction(i, e);
            }}
          >
            <div className="grid-cell checkbox-cell">
              <input type="checkbox" checked={isSelected(i)} readOnly tabIndex={-1} />
            </div>
            <div className="grid-cell id-cell mono">{row.id}</div>
            <div className="grid-cell task-cell">{row.task}</div>
            <div className="grid-cell">{row.assignee}</div>
            <div className="grid-cell">
              <span className="badge" style={{ background: STATUS_COLORS[row.status] + "20", color: STATUS_COLORS[row.status] }}>
                {row.status}
              </span>
            </div>
            <div className="grid-cell">
              <span className="badge" style={{ background: PRIORITY_COLORS[row.priority] + "20", color: PRIORITY_COLORS[row.priority] }}>
                {row.priority}
              </span>
            </div>
            <div className="grid-cell num-cell">{row.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
