import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const TOTAL = 48;

const ICONS = [
  "📄", "📁", "🖼️", "🎵", "🎬", "📊", "📝", "💾",
  "📦", "🔧", "📐", "🎨", "📎", "🔒", "⚙️", "🌐",
  "📧", "📅", "📋", "🗂️", "💡", "🔍", "🏷️", "📌",
];

export function TileView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection } =
    useRangeSelection({ totalItems: TOTAL });

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
        <h3>Tile View</h3>
        <span className="view-hint">Click tiles to select. Try Shift+Click, Ctrl+Click, Ctrl+Shift+Click</span>
        <button className="btn-clear" onClick={clearSelection}>Clear</button>
      </div>
      <KeyboardHints />
      <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      <div
        className="tile-grid"
        ref={containerRef}
        tabIndex={0}
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className={[
              "tile",
              isSelected(i) ? "selected" : "",
              isFocused(i) ? "focused" : "",
            ].join(" ")}
            onMouseDown={(e) => {
              e.preventDefault();
              handleItemInteraction(i, e);
            }}
          >
            <span className="tile-icon">{ICONS[i % ICONS.length]}</span>
            <span className="tile-label">Item {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
