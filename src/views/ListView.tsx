import { useEffect, useRef } from "react";
import { useRangeSelection } from "../hooks/useRangeSelection";
import { StatusBar } from "../components/StatusBar";
import { KeyboardHints } from "../components/KeyboardHints";

const TOTAL = 30;

const FILES = [
  { name: "project-brief.pdf", size: "2.4 MB", date: "May 12, 2026", type: "PDF" },
  { name: "design-system.fig", size: "18.7 MB", date: "May 11, 2026", type: "Figma" },
  { name: "api-spec.yaml", size: "340 KB", date: "May 10, 2026", type: "YAML" },
  { name: "meeting-notes.md", size: "12 KB", date: "May 9, 2026", type: "Markdown" },
  { name: "budget-q2.xlsx", size: "1.1 MB", date: "May 8, 2026", type: "Excel" },
  { name: "logo-final.svg", size: "56 KB", date: "May 7, 2026", type: "SVG" },
  { name: "user-research.pdf", size: "4.2 MB", date: "May 6, 2026", type: "PDF" },
  { name: "prototype-v3.fig", size: "22.1 MB", date: "May 5, 2026", type: "Figma" },
  { name: "release-notes.md", size: "8 KB", date: "May 4, 2026", type: "Markdown" },
  { name: "analytics-export.csv", size: "3.8 MB", date: "May 3, 2026", type: "CSV" },
  { name: "onboarding-flow.fig", size: "15.3 MB", date: "May 2, 2026", type: "Figma" },
  { name: "architecture.drawio", size: "890 KB", date: "May 1, 2026", type: "Diagram" },
  { name: "sprint-retro.md", size: "6 KB", date: "Apr 30, 2026", type: "Markdown" },
  { name: "icons-pack.zip", size: "7.4 MB", date: "Apr 29, 2026", type: "Archive" },
  { name: "test-coverage.html", size: "220 KB", date: "Apr 28, 2026", type: "HTML" },
  { name: "deploy-config.yml", size: "4 KB", date: "Apr 27, 2026", type: "YAML" },
  { name: "style-guide.pdf", size: "5.6 MB", date: "Apr 26, 2026", type: "PDF" },
  { name: "component-lib.ts", size: "45 KB", date: "Apr 25, 2026", type: "TypeScript" },
  { name: "roadmap-2026.xlsx", size: "2.1 MB", date: "Apr 24, 2026", type: "Excel" },
  { name: "error-logs.txt", size: "1.8 MB", date: "Apr 23, 2026", type: "Text" },
  { name: "brand-colors.json", size: "2 KB", date: "Apr 22, 2026", type: "JSON" },
  { name: "perf-report.pdf", size: "3.3 MB", date: "Apr 21, 2026", type: "PDF" },
  { name: "schema.prisma", size: "18 KB", date: "Apr 20, 2026", type: "Prisma" },
  { name: "changelog.md", size: "24 KB", date: "Apr 19, 2026", type: "Markdown" },
  { name: "env.example", size: "1 KB", date: "Apr 18, 2026", type: "Config" },
  { name: "docker-compose.yml", size: "3 KB", date: "Apr 17, 2026", type: "YAML" },
  { name: "sitemap.xml", size: "12 KB", date: "Apr 16, 2026", type: "XML" },
  { name: "backup-apr.tar.gz", size: "156 MB", date: "Apr 15, 2026", type: "Archive" },
  { name: "wireframes.fig", size: "9.8 MB", date: "Apr 14, 2026", type: "Figma" },
  { name: "security-audit.pdf", size: "6.7 MB", date: "Apr 13, 2026", type: "PDF" },
];

export function ListView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, handleItemInteraction, handleKeyDown, isSelected, isFocused, getSelectedCount, clearSelection, selectAll } =
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
    const rows = containerRef.current?.querySelectorAll(".list-row");
    (rows?.[state.focusedIndex] as HTMLElement)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [state.focusedIndex]);

  const allSelected = getSelectedCount() === TOTAL;

  return (
    <div className="view-section">
      <div className="view-sticky-toolbar">
        <div className="view-header">
          <h3>List View</h3>
          <span className="view-hint">Checkboxes auto-sync with selection state</span>
          <button className="btn-clear" onClick={clearSelection}>Clear</button>
        </div>
        <KeyboardHints />
        <StatusBar state={state} selectedCount={getSelectedCount()} totalItems={TOTAL} />
      </div>
      <div className="list-container" ref={containerRef} tabIndex={0}>
        <div className="list-header-row">
          <div className="list-cell checkbox-cell">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => (allSelected ? clearSelection() : selectAll())}
            />
          </div>
          <div className="list-cell name-cell">Name</div>
          <div className="list-cell">Type</div>
          <div className="list-cell">Size</div>
          <div className="list-cell">Modified</div>
        </div>
        {FILES.map((file, i) => (
          <div
            key={i}
            className={[
              "list-row",
              isSelected(i) ? "selected" : "",
              isFocused(i) ? "focused" : "",
            ].join(" ")}
            onMouseDown={(e) => {
              e.preventDefault();
              handleItemInteraction(i, e);
            }}
          >
            <div className="list-cell checkbox-cell">
              <input type="checkbox" checked={isSelected(i)} readOnly tabIndex={-1} />
            </div>
            <div className="list-cell name-cell">{file.name}</div>
            <div className="list-cell type-cell">{file.type}</div>
            <div className="list-cell">{file.size}</div>
            <div className="list-cell">{file.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
