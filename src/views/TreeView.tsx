import { useEffect, useRef, useMemo } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

interface TreeNode {
  id: string;
  label: string;
  icon: string;
  depth: number;
  isFolder: boolean;
  children?: number[];
}

const TREE: TreeNode[] = [
  { id: "src", label: "src", icon: "📁", depth: 0, isFolder: true, children: [1, 2, 3, 10, 17] },
  { id: "src/components", label: "components", icon: "📁", depth: 1, isFolder: true, children: [4, 5, 6, 7] },
  { id: "src/hooks", label: "hooks", icon: "📁", depth: 1, isFolder: true, children: [8, 9] },
  { id: "src/views", label: "views", icon: "📁", depth: 1, isFolder: true, children: [11, 12, 13, 14, 15, 16] },
  { id: "src/components/Button.tsx", label: "Button.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/components/Modal.tsx", label: "Modal.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/components/StatusBar.tsx", label: "StatusBar.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/components/Tooltip.tsx", label: "Tooltip.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/hooks/useRangeSelection.ts", label: "useRangeSelection.ts", icon: "🪝", depth: 2, isFolder: false },
  { id: "src/hooks/useDebounce.ts", label: "useDebounce.ts", icon: "🪝", depth: 2, isFolder: false },
  { id: "src/App.tsx", label: "App.tsx", icon: "⚛️", depth: 1, isFolder: false },
  { id: "src/views/TileView.tsx", label: "TileView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/views/ListView.tsx", label: "ListView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/views/CardView.tsx", label: "CardView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/views/GridRowView.tsx", label: "GridRowView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/views/ChartView.tsx", label: "ChartView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/views/TreeView.tsx", label: "TreeView.tsx", icon: "⚛️", depth: 2, isFolder: false },
  { id: "src/index.css", label: "index.css", icon: "🎨", depth: 1, isFolder: false },
  { id: "public", label: "public", icon: "📁", depth: 0, isFolder: true, children: [19, 20] },
  { id: "public/favicon.svg", label: "favicon.svg", icon: "🖼️", depth: 1, isFolder: false },
  { id: "public/robots.txt", label: "robots.txt", icon: "📄", depth: 1, isFolder: false },
  { id: "node_modules", label: "node_modules", icon: "📁", depth: 0, isFolder: true, children: [22, 23, 24] },
  { id: "node_modules/react", label: "react", icon: "📦", depth: 1, isFolder: false },
  { id: "node_modules/react-dom", label: "react-dom", icon: "📦", depth: 1, isFolder: false },
  { id: "node_modules/vite", label: "vite", icon: "📦", depth: 1, isFolder: false },
  { id: "package.json", label: "package.json", icon: "📋", depth: 0, isFolder: false },
  { id: "tsconfig.json", label: "tsconfig.json", icon: "⚙️", depth: 0, isFolder: false },
  { id: "vite.config.ts", label: "vite.config.ts", icon: "⚙️", depth: 0, isFolder: false },
  { id: "index.html", label: "index.html", icon: "🌐", depth: 0, isFolder: false },
  { id: ".gitignore", label: ".gitignore", icon: "📄", depth: 0, isFolder: false },
  { id: "README.md", label: "README.md", icon: "📝", depth: 0, isFolder: false },
];

const TOTAL = TREE.length;

export function TreeView() {
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
    const rows = containerRef.current?.querySelectorAll(".tree-row");
    (rows?.[state.focusedIndex] as HTMLElement)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.focusedIndex]);

  const allSelected = getSelectedCount() === TOTAL;

  const selectedFiles = useMemo(() => {
    const files: string[] = [];
    for (const r of state.ranges) {
      for (let i = r.start; i <= r.end; i++) {
        if (!TREE[i].isFolder) files.push(TREE[i].id);
      }
    }
    return files;
  }, [state.ranges]);

  return (
    <div className="view-section">
      <div className="view-header">
        <h3>Tree View</h3>
        <span className="view-hint">File tree with checkboxes. Click to toggle, Shift for range. Like VS Code explorer.</span>
        <button className="btn-clear" onClick={clearSelection}>Clear</button>
      </div>
      <KeyboardHints />
      <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />

      {selectedFiles.length > 0 && (
        <div className="tree-selection-summary">
          <span className="tree-summary-label">{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected:</span>
          <div className="tree-summary-files">
            {selectedFiles.map((f) => (
              <span key={f} className="tree-summary-file">{f}</span>
            ))}
          </div>
        </div>
      )}

      <div className="tree-container" ref={containerRef} tabIndex={0}>
        <div className="tree-header-row">
          <div className="tree-cb-cell">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? clearSelection() : selectAll())}
            />
          </div>
          <span className="tree-header-label">File Explorer</span>
        </div>
        {TREE.map((node, i) => (
          <div
            key={node.id}
            className={[
              "tree-row",
              isSelected(i) ? "selected" : "",
              isFocused(i) ? "focused" : "",
              node.isFolder ? "is-folder" : "",
            ].join(" ")}
            style={{ paddingLeft: 12 + node.depth * 20 }}
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
              className="tree-checkbox"
            />
            <span className="tree-indent">
              {node.depth > 0 && (
                <span className="tree-guide" style={{ width: node.depth * 20 }} />
              )}
            </span>
            <span className="tree-icon">{node.icon}</span>
            <span className={`tree-label ${node.isFolder ? "tree-label-folder" : ""}`}>
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
