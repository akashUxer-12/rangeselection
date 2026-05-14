import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const TOTAL = 18;

const CARDS = Array.from({ length: TOTAL }, (_, i) => ({
  title: [
    "User Authentication", "Payment Gateway", "Search Indexing",
    "Push Notifications", "Dark Mode Support", "Export to PDF",
    "Role-Based Access", "Real-time Chat", "Dashboard Analytics",
    "File Upload System", "Email Templates", "API Rate Limiting",
    "Two-Factor Auth", "Webhook System", "Audit Logging",
    "Data Migration", "CDN Integration", "Error Monitoring",
  ][i],
  status: ["Backlog", "To Do", "In Progress", "Review", "Done", "Shipped"][i % 6],
  priority: ["Critical", "High", "Medium", "Low"][i % 4],
  assignee: ["AK", "SP", "MR", "JL", "VC", "NK"][i % 6],
  color: ["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#06b6d4"][i % 6],
  progress: [15, 40, 72, 90, 100, 100, 0, 25, 55, 80, 95, 100, 10, 35, 60, 85, 100, 50][i],
  tags: [
    ["Backend", "Auth"], ["Backend", "Payments"], ["Backend", "Search"],
    ["Mobile", "Push"], ["Frontend", "UI"], ["Frontend", "Export"],
    ["Backend", "Security"], ["Fullstack", "WebSocket"], ["Frontend", "Charts"],
    ["Backend", "Storage"], ["Frontend", "Email"], ["Backend", "API"],
    ["Backend", "Security"], ["Backend", "Integration"], ["Backend", "Compliance"],
    ["Backend", "Data"], ["Infra", "CDN"], ["Infra", "Monitoring"],
  ][i],
}));

const STATUS_COLORS: Record<string, string> = {
  Backlog: "#6b7280",
  "To Do": "#8b5cf6",
  "In Progress": "#3b82f6",
  Review: "#f59e0b",
  Done: "#10b981",
  Shipped: "#06b6d4",
};

const PRIORITY_ICONS: Record<string, string> = {
  Critical: "🔴",
  High: "🟠",
  Medium: "🟡",
  Low: "⚪",
};

export function CardView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection } =
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
    const el = containerRef.current?.children[state.focusedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.focusedIndex]);

  return (
    <div className="view-section">
      <div className="view-header">
        <h3>Card View</h3>
        <span className="view-hint">Click cards to toggle. Shift+Click for range. Like Jira/Trello board cards.</span>
        <button className="btn-clear" onClick={clearSelection}>Clear</button>
      </div>
      <KeyboardHints />
      <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      <div className="card-grid" ref={containerRef} tabIndex={0}>
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={[
              "sel-card",
              isSelected(i) ? "selected" : "",
              isFocused(i) ? "focused" : "",
            ].join(" ")}
            onMouseDown={(e) => {
              e.preventDefault();
              handleItemInteraction(i, e);
            }}
          >
            <div className="sel-card-top">
              <span className="sel-card-index">#{i}</span>
              <span
                className="sel-card-status"
                style={{ background: STATUS_COLORS[card.status] + "20", color: STATUS_COLORS[card.status] }}
              >
                {card.status}
              </span>
            </div>
            <h4 className="sel-card-title">{card.title}</h4>
            <div className="sel-card-tags">
              {card.tags.map((tag) => (
                <span key={tag} className="sel-card-tag">{tag}</span>
              ))}
            </div>
            <div className="sel-card-progress-track">
              <div
                className="sel-card-progress-bar"
                style={{ width: `${card.progress}%`, background: card.color }}
              />
            </div>
            <div className="sel-card-bottom">
              <span className="sel-card-priority">{PRIORITY_ICONS[card.priority]} {card.priority}</span>
              <span
                className="sel-card-avatar"
                style={{ background: card.color + "30", color: card.color }}
              >
                {card.assignee}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
