import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const COLUMNS = [
  { key: "id", label: "ID", width: 80 },
  { key: "name", label: "Name", width: 160 },
  { key: "email", label: "Email", width: 200 },
  { key: "role", label: "Role", width: 120 },
  { key: "dept", label: "Department", width: 140 },
  { key: "status", label: "Status", width: 100 },
  { key: "joined", label: "Joined", width: 120 },
  { key: "salary", label: "Salary", width: 100 },
  { key: "location", label: "Location", width: 130 },
  { key: "phone", label: "Phone", width: 140 },
];

const ROWS = Array.from({ length: 12 }, (_, i) => ({
  id: `${1001 + i}`,
  name: ["Ava Chen", "Liam Patel", "Mia Rodriguez", "Noah Kim", "Emma Wilson", "Oliver Singh", "Sophia Lee", "James Taylor", "Isabella Brown", "Lucas Davis", "Charlotte Clark", "Ethan Moore"][i],
  email: ["ava@co.io", "liam@co.io", "mia@co.io", "noah@co.io", "emma@co.io", "oliver@co.io", "sophia@co.io", "james@co.io", "isabella@co.io", "lucas@co.io", "charlotte@co.io", "ethan@co.io"][i],
  role: ["Engineer", "Designer", "PM", "Engineer", "Designer", "Lead", "Engineer", "PM", "Designer", "Engineer", "Lead", "Engineer"][i],
  dept: ["Platform", "Product", "Growth", "Platform", "Brand", "Platform", "Mobile", "Growth", "Product", "Infra", "Mobile", "Platform"][i],
  status: ["Active", "Active", "Away", "Active", "Active", "Active", "Away", "Active", "Active", "Active", "Away", "Active"][i],
  joined: ["2024-01", "2024-03", "2023-11", "2025-02", "2024-07", "2023-06", "2025-01", "2024-09", "2023-12", "2025-04", "2024-05", "2024-11"][i],
  salary: ["$125K", "$98K", "$115K", "$130K", "$102K", "$145K", "$128K", "$112K", "$96K", "$135K", "$148K", "$118K"][i],
  location: ["SF", "NYC", "London", "SF", "LA", "Berlin", "Tokyo", "NYC", "SF", "Austin", "London", "Seattle"][i],
  phone: ["+1-555-0101", "+1-555-0102", "+44-20-7946", "+1-555-0104", "+1-555-0105", "+49-30-1234", "+81-3-1234", "+1-555-0108", "+1-555-0109", "+1-555-0110", "+44-20-7947", "+1-555-0112"][i],
}));

export function GridColumnView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection } =
    useRangeSelection({ totalItems: COLUMNS.length, clickMode: "standard" });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.focus();
    const handler = (e: KeyboardEvent) => handleKeyDown(e);
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [handleKeyDown]);

  return (
    <div className="view-section">
      <div className="view-header">
        <h3>Grid View — Column Selection</h3>
        <span className="view-hint">Click = select one column. Ctrl+Click = add/remove. Shift = range. Spreadsheet-style.</span>
        <button className="btn-clear" onClick={clearSelection}>Clear</button>
      </div>
      <KeyboardHints />
      <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={COLUMNS.length} />
      <div className="col-grid-wrapper" ref={containerRef} tabIndex={0}>
        <div className="col-grid-scroll">
          <table className="col-grid-table">
            <thead>
              <tr>
                {COLUMNS.map((col, ci) => (
                  <th
                    key={col.key}
                    className={[
                      "col-header",
                      isSelected(ci) ? "selected" : "",
                      isFocused(ci) ? "focused" : "",
                    ].join(" ")}
                    style={{ minWidth: col.width }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleItemInteraction(ci, e);
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={ri}>
                  {COLUMNS.map((col, ci) => (
                    <td
                      key={col.key}
                      className={isSelected(ci) ? "col-selected" : ""}
                    >
                      {row[col.key as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
