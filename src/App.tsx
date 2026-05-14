import { useState } from "react";
import { TileView } from "./views/TileView";
import { ListView } from "./views/ListView";
import { GridRowView } from "./views/GridRowView";
import { GridColumnView } from "./views/GridColumnView";
import { PatternDocs } from "./components/PatternDocs";
import { TestCases } from "./components/TestCases";
import { GridRowNoCheckboxView } from "./views/GridRowNoCheckboxView";
import { CardView } from "./views/CardView";
import { ChartView } from "./views/ChartView";
import { TreeView } from "./views/TreeView";

type Tab = "docs" | "tests" | "tile" | "cards" | "list" | "tree" | "grid-row-cb" | "grid-row" | "grid-col" | "chart";

const TABS: { id: Tab; label: string }[] = [
  { id: "docs", label: "Pattern Documentation" },
  { id: "tests", label: "Test Cases" },
  { id: "tile", label: "Tile View" },
  { id: "cards", label: "Card View" },
  { id: "list", label: "List View" },
  { id: "tree", label: "Tree View" },
  { id: "grid-row-cb", label: "Grid Rows ✓" },
  { id: "grid-row", label: "Grid Rows" },
  { id: "grid-col", label: "Grid Columns" },
  { id: "chart", label: "Chart X-Axis" },
];

export default function App() {
  const [active, setActive] = useState<Tab>("docs");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">RS</div>
            <div>
              <h1>Range Selection</h1>
              <p className="header-sub">Enterprise Selection Pattern — Interactive Specification</p>
            </div>
          </div>
          <div className="header-right">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="header-link">
              Design System
            </a>
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${active === tab.id ? "active" : ""}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {active === "docs" && <PatternDocs />}
        {active === "tests" && <TestCases />}
        {active === "tile" && <TileView />}
        {active === "cards" && <CardView />}
        {active === "list" && <ListView />}
        {active === "tree" && <TreeView />}
        {active === "grid-row-cb" && <GridRowView />}
        {active === "grid-row" && <GridRowNoCheckboxView />}
        {active === "grid-col" && <GridColumnView />}
        {active === "chart" && <ChartView />}
      </main>

      <footer className="app-footer">
        <p>Range Selection Pattern v1.0 — Part of your Design System</p>
        <p className="footer-hint">
          Try: <kbd>Click</kbd> <kbd>Ctrl+Click</kbd> <kbd>Shift+Click</kbd> <kbd>Ctrl+Shift+Click</kbd> <kbd>Enter</kbd> <kbd>Ctrl+Enter</kbd> <kbd>Shift+Enter</kbd> <kbd>Ctrl+Arrow</kbd> <kbd>Shift+Arrow</kbd> <kbd>Ctrl+A</kbd> <kbd>Esc</kbd>
        </p>
      </footer>
    </div>
  );
}
