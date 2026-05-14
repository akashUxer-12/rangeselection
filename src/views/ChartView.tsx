import { useEffect, useRef, useMemo } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26", "Jun'26",
  "Jul'26", "Aug'26", "Sep'26", "Oct'26", "Nov'26", "Dec'26",
];
const TOTAL = MONTHS.length;

const REVENUE = [
  42, 38, 55, 48, 62, 71,
  65, 78, 82, 74, 88, 95,
  92, 85, 105, 98, 112, 120,
  115, 128, 135, 125, 142, 155,
];

const USERS = [
  1200, 1350, 1500, 1420, 1680, 1900,
  1850, 2100, 2400, 2250, 2600, 2850,
  2780, 2950, 3200, 3100, 3500, 3800,
  3650, 4000, 4300, 4150, 4600, 5000,
];

const MAX_REV = Math.max(...REVENUE);
const MAX_USERS = Math.max(...USERS);

export function ChartView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection } =
    useRangeSelection({ totalItems: TOTAL, clickMode: "standard" });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.focus();
    const handler = (e: KeyboardEvent) => handleKeyDown(e);
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [handleKeyDown]);

  const summary = useMemo(() => {
    const selected = state.ranges;
    if (selected.length === 0) return null;
    let totalRev = 0;
    let totalUsers = 0;
    let count = 0;
    for (const r of selected) {
      for (let i = r.start; i <= r.end; i++) {
        totalRev += REVENUE[i];
        totalUsers += USERS[i];
        count++;
      }
    }
    return {
      months: count,
      revenue: totalRev,
      avgRevenue: Math.round(totalRev / count),
      totalUsers,
      avgUsers: Math.round(totalUsers / count),
    };
  }, [state.ranges]);

  return (
    <div className="view-section">
      <div className="view-sticky-toolbar">
        <div className="view-header">
          <h3>Chart — X-Axis Range Selection</h3>
          <span className="view-hint">Click bars or X-axis labels. Shift+Click for date range. Ctrl+Click to add months.</span>
          <button className="btn-clear" onClick={clearSelection}>Clear</button>
        </div>
        <KeyboardHints />
        <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      </div>

      {summary && (
        <div className="chart-summary">
          <div className="chart-summary-item">
            <span className="chart-summary-value">{summary.months}</span>
            <span className="chart-summary-label">Months Selected</span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-value">${summary.revenue}K</span>
            <span className="chart-summary-label">Total Revenue</span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-value">${summary.avgRevenue}K</span>
            <span className="chart-summary-label">Avg Revenue/mo</span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-value">{summary.totalUsers.toLocaleString()}</span>
            <span className="chart-summary-label">Total Users</span>
          </div>
          <div className="chart-summary-item">
            <span className="chart-summary-value">{summary.avgUsers.toLocaleString()}</span>
            <span className="chart-summary-label">Avg Users/mo</span>
          </div>
        </div>
      )}

      <div className="chart-wrapper" ref={containerRef} tabIndex={0}>
        {/* Y-axis */}
        <div className="chart-y-axis">
          <span>${MAX_REV}K</span>
          <span>${Math.round(MAX_REV / 2)}K</span>
          <span>$0K</span>
        </div>

        {/* Chart area */}
        <div className="chart-area">
          {/* Grid lines */}
          <div className="chart-gridlines">
            <div className="chart-gridline" style={{ bottom: "100%" }} />
            <div className="chart-gridline" style={{ bottom: "75%" }} />
            <div className="chart-gridline" style={{ bottom: "50%" }} />
            <div className="chart-gridline" style={{ bottom: "25%" }} />
            <div className="chart-gridline" style={{ bottom: "0%" }} />
          </div>

          {/* Line chart (users) */}
          <svg className="chart-line-svg" viewBox={`0 0 ${TOTAL * 48} 240`} preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#06b6d440"
              strokeWidth="2"
              points={USERS.map((u, i) => `${i * 48 + 24},${240 - (u / MAX_USERS) * 220}`).join(" ")}
            />
            {USERS.map((u, i) => (
              <circle
                key={i}
                cx={i * 48 + 24}
                cy={240 - (u / MAX_USERS) * 220}
                r={isSelected(i) ? 5 : 3}
                fill={isSelected(i) ? "#06b6d4" : "#06b6d460"}
              />
            ))}
          </svg>

          {/* Bars */}
          <div className="chart-bars">
            {REVENUE.map((rev, i) => {
              const height = (rev / MAX_REV) * 100;
              return (
                <div
                  key={i}
                  className={[
                    "chart-bar-col",
                    isSelected(i) ? "selected" : "",
                    isFocused(i) ? "focused" : "",
                  ].join(" ")}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleItemInteraction(i, e);
                  }}
                >
                  <div className="chart-bar-value">${rev}K</div>
                  <div
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="chart-x-axis">
          <div className="chart-x-spacer" />
          {MONTHS.map((m, i) => (
            <div
              key={i}
              className={[
                "chart-x-label",
                isSelected(i) ? "selected" : "",
                isFocused(i) ? "focused" : "",
              ].join(" ")}
              onMouseDown={(e) => {
                e.preventDefault();
                handleItemInteraction(i, e);
              }}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="chart-legend">
        <div className="chart-legend-item">
          <span className="chart-legend-swatch" style={{ background: "#6366f1" }} />
          Revenue ($K)
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-swatch chart-legend-line" style={{ background: "#06b6d4" }} />
          Active Users
        </div>
      </div>
    </div>
  );
}
