export function PatternDocs() {
  return (
    <div className="docs-section">
      <h2 className="docs-title">Range Selection Pattern</h2>
      <p className="docs-subtitle">
        Enterprise Standard Selection Model — follows the mental model used in Windows Explorer, Google Drive, Enterprise Data Grids, and Spreadsheet-style selection systems.
      </p>

      <div className="docs-grid">
        {/* Core Concepts */}
        <div className="doc-card full-width">
          <h3>1. Core Selection Concepts</h3>
          <p>The system maintains <strong>3 separate states</strong> internally:</p>
          <table className="doc-table">
            <thead>
              <tr><th>State</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              <tr><td><code>selectionRanges</code></td><td>Stores all selected items/ranges</td></tr>
              <tr><td><code>focusedIndex</code></td><td>Last interacted item — where Shift selection starts from</td></tr>
              <tr><td><code>shiftAnchorIndex</code></td><td>Temporary range anchor while Shift is pressed</td></tr>
            </tbody>
          </table>
          <div className="doc-callout">
            <strong>Mental Model:</strong> Selection = what is selected · Focus = where Shift starts from · Anchor = temporary active range start
          </div>
        </div>

        {/* Click — Two Modes */}
        <div className="doc-card full-width highlight-card">
          <h3>2. Click — Two Modes</h3>
          <p className="doc-purpose">The hook supports two click modes depending on the view type.</p>
          <table className="doc-table">
            <thead>
              <tr><th>Mode</th><th>Click Behavior</th><th>Used In</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>toggle</code></td>
                <td>Add or remove the clicked item. Existing selection preserved.</td>
                <td>Tile View, List View (checkbox UIs)</td>
              </tr>
              <tr>
                <td><code>standard</code></td>
                <td>Clear everything, select only the clicked item.</td>
                <td>Grid Rows, Grid Columns (data grid UIs)</td>
              </tr>
            </tbody>
          </table>
          <div className="doc-state-update">
            <code>{"clickMode: \"toggle\" | \"standard\""}</code>
          </div>
        </div>

        {/* Click — Toggle Mode */}
        <div className="doc-card">
          <h3>2a. Click — Toggle Mode</h3>
          <p className="doc-purpose">Toggle a single item — add it or remove it. Existing selection preserved.</p>
          <div className="doc-behavior">
            <div className="behavior-row"><span className="key-combo">Click</span> unselected → adds it to selection</div>
            <div className="behavior-row"><span className="key-combo">Click</span> selected → removes it from selection</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example — Add</div>
            <div className="example-step">Initial: selection = <span className="range">[5,10]</span></div>
            <div className="example-step">Click 20</div>
            <div className="example-result">Result: <span className="range">[5,10]</span> + <span className="range">[20]</span></div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example — Remove</div>
            <div className="example-step">Initial: selection = <span className="range">[5,15]</span></div>
            <div className="example-step">Click 7</div>
            <div className="example-result">Result: <span className="range">[5,6]</span> + <span className="range">[8,15]</span></div>
          </div>
          <div className="doc-callout">
            <strong>Used in Tile View and List View.</strong> Users can build up multi-selections one click at a time without holding any modifier key. Click and Ctrl+Click behave identically in this mode.
          </div>
        </div>

        {/* Click — Standard Mode */}
        <div className="doc-card">
          <h3>2b. Click — Standard Mode</h3>
          <p className="doc-purpose">Clear everything, select only the clicked item.</p>
          <div className="doc-behavior">
            <div className="behavior-row"><span className="key-combo">Click</span> any item → clears all, selects only that item</div>
            <div className="behavior-row"><span className="key-combo">Ctrl+Click</span> → toggle add/remove (preserves rest)</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example — Click</div>
            <div className="example-step">Initial: selection = <span className="range">[5,15]</span></div>
            <div className="example-step">Click 20</div>
            <div className="example-result">Result: <span className="range">[20]</span> only — previous range cleared</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example — Ctrl+Click</div>
            <div className="example-step">Initial: selection = <span className="range">[5,15]</span></div>
            <div className="example-step">Ctrl + Click 20</div>
            <div className="example-result">Result: <span className="range">[5,15]</span> + <span className="range">[20]</span></div>
          </div>
          <div className="doc-callout">
            <strong>Used in Grid Rows and Grid Columns.</strong> Matches Windows Explorer, macOS Finder, Google Drive. Click does the simplest thing — select just this one. Multi-selection requires the Ctrl/Cmd modifier.
          </div>
        </div>

        {/* Ctrl+Click */}
        <div className="doc-card">
          <h3>3. Ctrl/Cmd + Click</h3>
          <p className="doc-purpose">Toggle one item without touching the rest. Works the same in both modes.</p>
          <div className="doc-behavior">
            <div className="behavior-row"><span className="key-combo">Ctrl+Click</span> unselected → add to selection</div>
            <div className="behavior-row"><span className="key-combo">Ctrl+Click</span> selected → remove from selection</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Add Item</div>
            <div className="example-step">Initial: <span className="range">[5,15]</span></div>
            <div className="example-step">Ctrl + Click 25</div>
            <div className="example-result">Result: <span className="range">[5,15]</span> + <span className="range">[25]</span></div>
          </div>
          <div className="doc-example">
            <div className="example-label">Remove Item</div>
            <div className="example-step">Initial: <span className="range">[5,15]</span> + <span className="range">[25]</span></div>
            <div className="example-step">Ctrl + Click 10</div>
            <div className="example-result">Result: <span className="range">[5,9]</span> + <span className="range">[11,15]</span> + <span className="range">[25]</span></div>
          </div>
        </div>

        {/* Shift+Click */}
        <div className="doc-card">
          <h3>4. First Shift + Click</h3>
          <p className="doc-purpose">Create ONE continuous range from focused index to clicked index.</p>
          <div className="doc-behavior">
            <div className="behavior-row">Uses <code>anchor = focusedIndex</code></div>
            <div className="behavior-row">Creates continuous range <code>anchor → clickedIndex</code></div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Click 5</div>
            <div className="example-step">Shift + Click 15</div>
            <div className="example-result">Result: <span className="range">[5,15]</span>, anchor = 5</div>
          </div>
        </div>

        {/* Continuous Shift */}
        <div className="doc-card">
          <h3>5. Continuous Shift Holding</h3>
          <p className="doc-purpose">Adjust the currently active range while holding Shift.</p>
          <div className="doc-behavior">
            <div className="behavior-row">Anchor remains fixed</div>
            <div className="behavior-row">Only range endpoint changes</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Click 5 → Shift+15 → Shift+13 → Shift+19</div>
            <div className="example-result">After 15: <span className="range">[5,15]</span></div>
            <div className="example-result">After 13: <span className="range">[5,13]</span></div>
            <div className="example-result">After 19: <span className="range">[5,19]</span></div>
          </div>
        </div>

        {/* Shift Release */}
        <div className="doc-card">
          <h3>6. Shift Release Behavior</h3>
          <p className="doc-purpose">Finish the active range interaction.</p>
          <div className="doc-behavior">
            <div className="behavior-row"><code>shiftAnchorIndex = null</code></div>
            <div className="behavior-row">Selection and focusedIndex remain</div>
          </div>
          <div className="doc-example">
            <div className="example-label">Before Release</div>
            <div className="example-result">selection = <span className="range">[5,19]</span>, anchor = 5</div>
            <div className="example-label">After Release</div>
            <div className="example-result">selection = <span className="range">[5,19]</span>, anchor = null</div>
          </div>
        </div>

        {/* New Shift After Release */}
        <div className="doc-card">
          <h3>7. New Shift Interaction After Release</h3>
          <p className="doc-purpose">Start a NEW range from focusedIndex (not old anchor).</p>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Click 22 → Shift+27 → Release Shift → Shift+5</div>
            <div className="example-result">Result: <span className="range">[5,27]</span> (anchor = 27, NOT 22)</div>
          </div>
          <div className="doc-callout">Because old anchor was cleared; latest focusedIndex (27) becomes new anchor.</div>
        </div>

        {/* Reverse Direction */}
        <div className="doc-card">
          <h3>8. Reverse Direction Selection</h3>
          <p className="doc-purpose">Backward range selection normalizes automatically.</p>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Click 20 → Shift+10</div>
            <div className="example-result">Result: <span className="range">[10,20]</span></div>
          </div>
        </div>

        {/* Reverse Deselection */}
        <div className="doc-card">
          <h3>9. Reverse Direction Deselection</h3>
          <p className="doc-purpose">Shrink active range by moving endpoint backwards.</p>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Click 10 → Shift+25 → Shift+18</div>
            <div className="example-result">After 25: <span className="range">[10,25]</span></div>
            <div className="example-result">After 18: <span className="range">[10,18]</span> — items 19–25 deselected</div>
          </div>
        </div>

        {/* Multi-Range */}
        <div className="doc-card">
          <h3>10. Existing Multi-Range Selection</h3>
          <p className="doc-purpose">Support disconnected selections via Ctrl+Click or Ctrl+Shift+Click.</p>
          <div className="doc-example">
            <div className="example-result"><span className="range">[5,15]</span> + <span className="range">[20,30]</span></div>
          </div>
        </div>

        {/* Shift Inside Range */}
        <div className="doc-card">
          <h3>11. Shift + Click Inside Existing Range</h3>
          <p className="doc-purpose">Shift creates ONE active range, does NOT preserve disconnected ranges.</p>
          <div className="doc-example">
            <div className="example-label">Example</div>
            <div className="example-step">Initial: <span className="range">[5,15]</span> + <span className="range">[20,30]</span>, focused = 7</div>
            <div className="example-step">Shift + Click 25</div>
            <div className="example-result">Result: <span className="range">[7,25]</span> — old ranges replaced</div>
          </div>
        </div>

        {/* Shift Outside Range */}
        <div className="doc-card">
          <h3>12. Shift + Click Outside Existing Range</h3>
          <div className="doc-example">
            <div className="example-step">Initial: <span className="range">[5,15]</span>, focused = 5</div>
            <div className="example-step">Shift + Click 25</div>
            <div className="example-result">Result: <span className="range">[5,25]</span></div>
          </div>
        </div>

        {/* Shift Backward */}
        <div className="doc-card">
          <h3>13. Shift + Click Backward From Existing Range</h3>
          <div className="doc-example">
            <div className="example-step">Initial: <span className="range">[20,30]</span>, focused = 20</div>
            <div className="example-step">Shift + Click 10</div>
            <div className="example-result">Result: <span className="range">[10,20]</span> — items 21–30 deselected</div>
          </div>
        </div>

        {/* Ctrl+Shift+Click */}
        <div className="doc-card highlight-card">
          <h3>14. Ctrl/Cmd + Shift + Click</h3>
          <p className="doc-purpose">Add ANOTHER continuous range while preserving old ranges. Power-user interaction.</p>
          <div className="doc-example">
            <div className="example-step">Initial: <span className="range">[5,15]</span>, focused = 20</div>
            <div className="example-step">Ctrl + Shift + Click 25</div>
            <div className="example-result">Result: <span className="range">[5,15]</span> + <span className="range">[20,25]</span></div>
          </div>
          <table className="doc-table compact">
            <thead>
              <tr><th>Interaction</th><th>Behavior</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Shift + Click</code></td><td>Replace active selection with one range</td></tr>
              <tr><td><code>Ctrl + Shift + Click</code></td><td>Add another range, preserve existing</td></tr>
            </tbody>
          </table>
        </div>

        {/* Range Merge */}
        <div className="doc-card">
          <h3>15. Range Merge Behavior</h3>
          <p className="doc-purpose">Overlapping ranges merge automatically to avoid fragmentation.</p>
          <div className="doc-example">
            <div className="example-step">Existing: <span className="range">[5,15]</span></div>
            <div className="example-step">Ctrl + Shift to add <span className="range">[10,25]</span></div>
            <div className="example-result">Result: <span className="range">[5,25]</span> (merged, not [5,15] + [10,25])</div>
          </div>
        </div>

        {/* Keyboard */}
        <div className="doc-card full-width">
          <h3>16. Keyboard Behavior</h3>
          <p className="doc-purpose">Full keyboard navigation and selection. Arrows move focus only — press Space/Enter to act.</p>

          <h4 style={{fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginTop: 16, marginBottom: 8}}>Navigation (move focus only)</h4>
          <table className="doc-table">
            <thead>
              <tr><th>Key</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Arrow ↑↓←→</code></td><td>Move focus to next/previous item — <strong>no selection change</strong></td></tr>
              <tr><td><code>Home</code></td><td>Jump focus to first item</td></tr>
              <tr><td><code>End</code></td><td>Jump focus to last item</td></tr>
            </tbody>
          </table>

          <h4 style={{fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginTop: 16, marginBottom: 8}}>Selection (act on focused item)</h4>
          <table className="doc-table">
            <thead>
              <tr><th>Key</th><th>Action</th><th>Mouse Equivalent</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Space / Enter</code></td><td>Select/toggle the focused item</td><td>Click</td></tr>
              <tr><td><code>Ctrl + Space</code></td><td>Toggle focused item, preserve rest</td><td>Ctrl + Click</td></tr>
              <tr><td><code>Shift + Space</code></td><td>Range from anchor to focused</td><td>Shift + Click</td></tr>
              <tr><td><code>Ctrl + Shift + Space</code></td><td>Add range, preserve existing</td><td>Ctrl + Shift + Click</td></tr>
            </tbody>
          </table>

          <h4 style={{fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginTop: 16, marginBottom: 8}}>Range extend via arrows</h4>
          <table className="doc-table">
            <thead>
              <tr><th>Key</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Shift + Arrow</code></td><td>Extend/shrink range one item at a time</td></tr>
              <tr><td><code>Ctrl + Shift + Arrow</code></td><td>Extend range additively (preserve existing)</td></tr>
              <tr><td><code>Shift + Home</code></td><td>Select from focused to first item</td></tr>
              <tr><td><code>Shift + End</code></td><td>Select from focused to last item</td></tr>
            </tbody>
          </table>

          <h4 style={{fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)", marginTop: 16, marginBottom: 8}}>Utility</h4>
          <table className="doc-table">
            <thead>
              <tr><th>Key</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td><code>Ctrl/Cmd + A</code></td><td>Select all items</td></tr>
              <tr><td><code>Escape</code></td><td>Clear all selection</td></tr>
            </tbody>
          </table>

          <div className="doc-callout">
            <strong>Arrows never select.</strong> They only move the focus ring. Press <code>Space</code> or <code>Enter</code> to commit. This matches native checkbox list behavior and is critical for building disconnected ranges via keyboard: arrow to an item → <code>Ctrl+Space</code> to toggle it → arrow elsewhere → repeat.
          </div>
        </div>

        {/* Visual States */}
        <div className="doc-card">
          <h3>17. Recommended Visual States</h3>
          <div className="visual-states">
            <div className="vs-row">
              <div className="vs-demo vs-selected">Selected</div>
              <span>Filled background / highlight</span>
            </div>
            <div className="vs-row">
              <div className="vs-demo vs-focused">Focused</div>
              <span>Focus ring / dotted outline</span>
            </div>
            <div className="vs-row">
              <div className="vs-demo vs-hover">Hover</div>
              <span>Subtle hover state</span>
            </div>
            <div className="vs-row">
              <div className="vs-demo vs-selected vs-focused">Both</div>
              <span>Selected + Focused combined</span>
            </div>
          </div>
          <div className="doc-callout">Focused item and selected item are <strong>different concepts</strong>.</div>
        </div>

        {/* Dev Logic */}
        <div className="doc-card full-width">
          <h3>18. Dev Logic (Algorithm)</h3>
          <div className="algo-grid">
            <div className="algo-block">
              <div className="algo-title">CLICK (TOGGLE MODE)</div>
              <pre>{`toggle clicked item in selection
preserve all other selections
focusedIndex = clickedIndex
shiftAnchorIndex = null`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">CLICK (STANDARD MODE)</div>
              <pre>{`clear all selection
select only clicked item
focusedIndex = clickedIndex
shiftAnchorIndex = null`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">CTRL/CMD + CLICK</div>
              <pre>{`toggle clicked item only
preserve existing ranges
focusedIndex = clickedIndex
shiftAnchorIndex = null`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SHIFT + CLICK</div>
              <pre>{`if shiftAnchor == null:
  shiftAnchor = focusedIndex
replace selection with:
  range(shiftAnchor → clicked)
focusedIndex = clickedIndex`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">CTRL/CMD + SHIFT + CLICK</div>
              <pre>{`if shiftAnchor == null:
  shiftAnchor = focusedIndex
additiveRange =
  range(shiftAnchor → clicked)
merge additive with existing
focusedIndex = clickedIndex`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">ARROW KEYS</div>
              <pre>{`move focusedIndex ±1
do NOT change selection
shiftAnchorIndex = null`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SPACE / ENTER</div>
              <pre>{`same as Click on focusedIndex
respects clickMode
+ all modifier combos:
  Ctrl, Shift, Ctrl+Shift`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SHIFT + ARROW</div>
              <pre>{`extend range by ±1 item
anchor = focusedIndex (if null)
same as Shift+Click on
  adjacent item`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SHIFT KEY UP</div>
              <pre>{`shiftAnchorIndex = null`}</pre>
            </div>
          </div>
        </div>

        {/* Mental Model */}
        <div className="doc-card full-width mental-model-card">
          <h3>19. Final Mental Model</h3>
          <div className="mental-model-grid">
            <div className="mm-item">
              <span className="mm-key">Click (toggle)</span>
              <span className="mm-desc">Add or remove one item</span>
            </div>
            <div className="mm-item">
              <span className="mm-key">Click (standard)</span>
              <span className="mm-desc">Clear all, select only this one</span>
            </div>
            <div className="mm-item">
              <span className="mm-key">Ctrl + Click</span>
              <span className="mm-desc">Add / remove one (preserve rest)</span>
            </div>
            <div className="mm-item">
              <span className="mm-key">Shift + Click</span>
              <span className="mm-desc">Select one continuous range</span>
            </div>
            <div className="mm-item">
              <span className="mm-key">Ctrl + Shift + Click</span>
              <span className="mm-desc">Add another range (preserve rest)</span>
            </div>
          </div>
        </div>

        {/* View Type Matrix */}
        <div className="doc-card full-width">
          <h3>21. View Type Matrix</h3>
          <p className="doc-purpose">How the pattern adapts to different UI types. Same hook, different configurations.</p>
          <table className="doc-table">
            <thead>
              <tr><th>View</th><th>Click Mode</th><th>Checkboxes</th><th>Select All</th><th>Use Case</th></tr>
            </thead>
            <tbody>
              <tr><td>Tile View</td><td><code>toggle</code></td><td>No</td><td>No</td><td>Icons, thumbnails, file grid</td></tr>
              <tr><td>Card View</td><td><code>toggle</code></td><td>Yes (on hover)</td><td>No</td><td>Kanban cards, project boards</td></tr>
              <tr><td>List View</td><td><code>toggle</code></td><td>Yes (always)</td><td>Yes</td><td>File list, email inbox</td></tr>
              <tr><td>Tree View</td><td><code>toggle</code></td><td>Yes (always)</td><td>Yes</td><td>File explorer, org chart</td></tr>
              <tr><td>Grid Rows (checkbox)</td><td><code>toggle</code></td><td>Yes (always)</td><td>Yes</td><td>Data grid with bulk actions</td></tr>
              <tr><td>Grid Rows (no checkbox)</td><td><code>standard</code></td><td>No</td><td>No</td><td>Read-heavy data table</td></tr>
              <tr><td>Grid Columns</td><td><code>standard</code></td><td>No</td><td>No</td><td>Spreadsheet column selection</td></tr>
              <tr><td>Chart X-Axis</td><td><code>standard</code></td><td>No</td><td>No</td><td>Date/category range picker</td></tr>
            </tbody>
          </table>
          <div className="doc-callout">
            <strong>Rule of thumb:</strong> If the view has checkboxes or items look individually tappable (cards, tiles), use <code>toggle</code>. If the view is a data grid or spreadsheet where click means "focus on this one," use <code>standard</code>.
          </div>
        </div>

        {/* Checkbox Patterns */}
        <div className="doc-card full-width">
          <h3>22. Checkbox Patterns</h3>
          <p className="doc-purpose">Three ways to use checkboxes with range selection.</p>
          <div className="algo-grid">
            <div className="algo-block">
              <div className="algo-title">ALWAYS VISIBLE</div>
              <pre>{`Checkbox shown on every item.
Click row = toggle checkbox.
Header checkbox = select all.

Used in: List View, Tree View,
Grid Rows (with checkbox)`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SHOW ON HOVER / FOCUS / SELECTED</div>
              <pre>{`Checkbox hidden by default.
Appears on: hover, focus, or
when item is selected.
Cleaner look, same behavior.

Used in: Card View`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">NO CHECKBOX</div>
              <pre>{`Selection shown via background
highlight + focus ring only.
Ctrl+Click to multi-select.

Used in: Tile View, Grid Rows
(no checkbox), Grid Columns,
Chart X-Axis`}</pre>
            </div>
          </div>
          <div className="doc-callout">
            <strong>Important:</strong> Checkboxes are always <code>readOnly</code> visual indicators. All click handling goes through <code>onMouseDown</code> on the row/card, never <code>onChange</code> on the checkbox. This ensures Shift+Click and Ctrl+Click work correctly.
          </div>
        </div>

        {/* Accessibility */}
        <div className="doc-card full-width">
          <h3>23. Accessibility</h3>
          <p className="doc-purpose">Keyboard-first design ensures the pattern is fully operable without a mouse.</p>
          <div className="algo-grid">
            <div className="algo-block">
              <div className="algo-title">FOCUS MANAGEMENT</div>
              <pre>{`Container: tabIndex={0}
Auto-focus on mount/tab switch
Focused item scrolls into view
Focus ring always visible`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">KEYBOARD WORKFLOW</div>
              <pre>{`Arrow keys → move focus
Space/Enter → select/toggle
Shift+Space → range select
Ctrl+Space → additive toggle
Ctrl+Shift+Space → add range`}</pre>
            </div>
            <div className="algo-block">
              <div className="algo-title">SCREEN READERS</div>
              <pre>{`Checkbox state syncs with
isSelected() for AT.
Focus ring provides visual
and programmatic focus.
role="listbox" recommended
for production.`}</pre>
            </div>
          </div>
          <div className="doc-callout">
            <strong>Arrows never select.</strong> They only move focus. This matches native listbox behavior and allows keyboard users to navigate without accidentally changing selection. Press <code>Space</code> to commit.
          </div>
        </div>

        {/* Why This Works — 3 Key Insights */}
        <div className="doc-card full-width highlight-card">
          <h3>20. Why This Pattern Works — 3 Things Most Implementations Get Wrong</h3>

          <div className="insight-grid">
            <div className="insight-block">
              <div className="insight-number">1</div>
              <div className="insight-content">
                <h4>The Three-State Model</h4>
                <p>
                  This pattern tracks three separate things: <strong>what is selected</strong> (the ranges),
                  <strong> which item you last interacted with</strong> (focused index), and
                  <strong> where the current Shift-drag started from</strong> (shift anchor).
                </p>
                <p>
                  Most buggy implementations mix these up. They treat "focused" and "selected" as the same thing,
                  or they don't track the shift anchor at all. This leads to broken behavior when users do
                  multi-step selections — like selecting a range, releasing Shift, then starting another range.
                </p>
                <p className="insight-simple">
                  <strong>Simple version:</strong> The system needs to remember three things separately —
                  what's highlighted, where you last clicked, and where you started dragging from.
                  If you combine any two of these, the selection will break in edge cases.
                </p>
              </div>
            </div>

            <div className="insight-block">
              <div className="insight-number">2</div>
              <div className="insight-content">
                <h4>Shift vs Ctrl+Shift — They Do Different Things</h4>
                <p>
                  <strong>Shift + Click</strong> says "I want ONE range — from where I was to where I clicked."
                  It throws away everything else. If you had items 5–15 selected and Shift+Click item 25,
                  you get 5–25. The old selection is replaced.
                </p>
                <p>
                  <strong>Ctrl + Shift + Click</strong> says "I want to ADD another range WITHOUT losing what I already have."
                  If you had items 5–15 selected and Ctrl+Shift+Click from 20 to 25,
                  you get 5–15 AND 20–25. Both ranges are preserved.
                </p>
                <p className="insight-simple">
                  <strong>Simple version:</strong> Shift = "replace my selection with this range."
                  Ctrl+Shift = "keep my selection AND add this range too."
                  Most custom implementations either don't support Ctrl+Shift at all,
                  or treat it the same as Shift — both are wrong.
                </p>
              </div>
            </div>

            <div className="insight-block">
              <div className="insight-number">3</div>
              <div className="insight-content">
                <h4>The Anchor Has a Lifecycle</h4>
                <p>
                  When you first hold Shift and click, the system remembers where you started — that's the "anchor."
                  While you keep holding Shift, the anchor stays put — only the other end of the range moves.
                  When you release Shift, the anchor is erased.
                </p>
                <p>
                  Here's the part that trips people up: when you press Shift again later,
                  the new anchor is set from <strong>wherever the focused item ended up</strong>,
                  not from the old anchor position. This is exactly how Windows Explorer and macOS Finder work.
                </p>
                <p className="insight-simple">
                  <strong>Simple version:</strong> Think of the anchor like a temporary pin.
                  Hold Shift → pin drops where you are. Keep holding → pin stays, other end moves freely.
                  Release Shift → pin is removed. Next time you hold Shift → a new pin drops at your current position.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
