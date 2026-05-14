export function TestCases() {
  return (
    <div className="docs-section">
      <h2 className="docs-title">Test Cases</h2>
      <p className="docs-subtitle">
        Complete validation checklist for range selection behavior. Use these to verify any implementation matches the enterprise standard — across tile, list, grid row, and grid column views.
      </p>

      {/* Legend */}
      <div className="tc-legend">
        <span className="tc-tag tc-click">Click</span>
        <span className="tc-tag tc-ctrl">Ctrl/Cmd</span>
        <span className="tc-tag tc-shift">Shift</span>
        <span className="tc-tag tc-ctrlshift">Ctrl+Shift</span>
        <span className="tc-tag tc-keyboard">Keyboard</span>
        <span className="tc-tag tc-edge">Edge Case</span>
      </div>

      {/* TC Group 1: Plain Click */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-click">Click</span>
          Plain Click — Toggle Item (Multi-Select)
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-001</span>
            <span className="tc-name">Click unselected item with nothing selected</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>No items selected</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 5</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5]</span>, focused = 5, anchor = null</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-002</span>
            <span className="tc-name">Click adds unselected item to existing selection</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 20</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,15]</span> + <span className="range">[20]</span> — existing range preserved</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-003</span>
            <span className="tc-name">Click removes a selected item (middle of range)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 10 (inside existing range)</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,9]</span> + <span className="range">[11,15]</span> — range splits around removed item</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-004</span>
            <span className="tc-name">Click adds to multi-range selection</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 30</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span> + <span className="range">[30]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-005</span>
            <span className="tc-name">Click resets shift anchor</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>anchor = 5 (from previous Shift interaction)</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 12</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">anchor = null, focused = 12</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-005a</span>
            <span className="tc-name">Multiple clicks build up selection one by one</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>No items selected</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click 3, Click 7, Click 12, Click 20</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[3]</span> + <span className="range">[7]</span> + <span className="range">[12]</span> + <span className="range">[20]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-005b</span>
            <span className="tc-name">Click adjacent item merges into existing range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click item 11</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,11]</span> — merged, not [5,10] + [11]</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-005c</span>
            <span className="tc-name">Click and Ctrl+Click produce identical behavior</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action A</span><span>Click item 20</span></div>
            <div className="tc-row"><span className="tc-label">Action B</span><span>Ctrl + Click item 20 (from same precondition)</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">Both produce: <span className="range">[5,10]</span> + <span className="range">[20]</span> — identical results</span></div>
          </div>
        </div>
      </div>

      {/* TC Group 2: Ctrl/Cmd + Click */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-ctrl">Ctrl/Cmd</span>
          Ctrl/Cmd + Click — Same as Click (Toggle)
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-006</span>
            <span className="tc-name">Ctrl+Click adds an unselected item</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 25</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,15]</span> + <span className="range">[25]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-007</span>
            <span className="tc-name">Ctrl+Click removes a selected item (middle of range)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,9]</span> + <span className="range">[11,15]</span> — range splits</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-008</span>
            <span className="tc-name">Ctrl+Click removes the start of a range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 5</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[6,15]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-009</span>
            <span className="tc-name">Ctrl+Click removes the end of a range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 15</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,14]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-010</span>
            <span className="tc-name">Ctrl+Click on single selected item deselects it</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[10]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = empty, focused = 10</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-011</span>
            <span className="tc-name">Ctrl+Click preserves other disconnected ranges</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 30</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span> + <span className="range">[30]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-012</span>
            <span className="tc-name">Ctrl+Click adds adjacent item — ranges merge</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Click item 11</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,11]</span> — merged, not [5,10] + [11]</span></div>
          </div>
        </div>
      </div>

      {/* TC Group 3: Shift + Click */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-shift">Shift</span>
          Shift + Click — Continuous Range
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-013</span>
            <span className="tc-name">First Shift+Click creates range from focused to clicked</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 5 (focused = 5)</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 15</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,15]</span>, focused = 15, anchor = 5</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-014</span>
            <span className="tc-name">Continuous Shift — expand range forward</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click 5, Shift+Click 15 (anchor = 5, selection = [5,15])</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 20 (Shift still held)</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,20]</span>, anchor still = 5</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-015</span>
            <span className="tc-name">Continuous Shift — shrink range (reverse direction deselection)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click 5, Shift+Click 20 (anchor = 5, selection = [5,20])</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 12 (Shift still held)</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,12]</span> — items 13–20 deselected</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-016</span>
            <span className="tc-name">Reverse direction selection (backward)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 20 (focused = 20)</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,20]</span> — normalized, anchor = 20</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-017</span>
            <span className="tc-name">Shift+Click replaces existing multi-range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span>, focused = 7</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 22</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[7,22]</span> — both old ranges replaced with one</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-018</span>
            <span className="tc-name">Shift+Click outside existing range extends</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span>, focused = 5</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 25</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,25]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-019</span>
            <span className="tc-name">Shift+Click backward from existing range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[20,30]</span>, focused = 20</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,20]</span> — items 21–30 deselected</span></div>
          </div>
        </div>
      </div>

      {/* TC Group 4: Shift Release + Re-Shift */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-shift">Shift</span>
          Shift Release and Re-Shift Behavior
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-020</span>
            <span className="tc-name">Shift release clears anchor but keeps selection</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click 5, Shift+Click 15 → selection = [5,15], anchor = 5</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Release Shift key</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,15]</span> (unchanged), focused = 15, anchor = null</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-021</span>
            <span className="tc-name">New Shift after release anchors from focusedIndex, not old anchor</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click 10, Shift+Click 20, Release Shift → focused = 20, anchor = null</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 5</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,20]</span>, anchor = 20 (not 10)</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-022</span>
            <span className="tc-name">Click between Shift interactions resets anchor point</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click 5, Shift+Click 15, Release Shift</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Click 22, then Shift + Click 27</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[22,27]</span>, anchor = 22 — previous range gone</span></div>
          </div>
        </div>
      </div>

      {/* TC Group 5: Ctrl + Shift + Click */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-ctrlshift">Ctrl+Shift</span>
          Ctrl/Cmd + Shift + Click — Additive Range
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-023</span>
            <span className="tc-name">Ctrl+Shift+Click adds range while preserving existing</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span>, focused = 20</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Shift + Click item 25</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,15]</span> + <span className="range">[20,25]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-024</span>
            <span className="tc-name">Ctrl+Shift+Click with overlapping range — auto-merge</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span>, focused = 10</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Shift + Click item 25</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,25]</span> — merged, not [5,15] + [10,25]</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-025</span>
            <span className="tc-name">Ctrl+Shift+Click backward</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[20,30]</span>, focused = 15</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Shift + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,15]</span> + <span className="range">[20,30]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-026</span>
            <span className="tc-name">Ctrl+Shift+Click fills gap between ranges — merges all</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span> + <span className="range">[20,25]</span>, focused = 12</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl + Shift + Click item 18</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[5,25]</span> — all three ranges merge into one</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-027</span>
            <span className="tc-name">Shift+Click vs Ctrl+Shift+Click — verify different behavior</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,10]</span>, focused = 20</span></div>
            <div className="tc-row"><span className="tc-label">Action A</span><span>Shift + Click 25 → Result: <span className="range">[20,25]</span> only (old range gone)</span></div>
            <div className="tc-row"><span className="tc-label">Action B</span><span>Ctrl+Shift + Click 25 → Result: <span className="range">[5,10]</span> + <span className="range">[20,25]</span> (preserved)</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">Action A and B produce different results</span></div>
          </div>
        </div>
      </div>

      {/* TC Group 6: Keyboard */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-keyboard">Keyboard</span>
          Keyboard Interactions
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-028</span>
            <span className="tc-name">Shift + ArrowDown extends selection</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 10 → focused = 10</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + ArrowDown</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,11]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-029</span>
            <span className="tc-name">Shift + ArrowUp extends selection backward</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 10 → focused = 10</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + ArrowUp</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[9,10]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-030</span>
            <span className="tc-name">Repeated Shift + ArrowDown grows range</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift+↓, Shift+↓, Shift+↓</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,13]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-031</span>
            <span className="tc-name">Ctrl/Cmd + A selects all items</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Any state (totalItems = 48)</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Ctrl/Cmd + A</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[0,47]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-032</span>
            <span className="tc-name">Escape clears all selection</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>selection = <span className="range">[5,15]</span> + <span className="range">[20,25]</span></span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Press Escape</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = empty, focused = null, anchor = null</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-033</span>
            <span className="tc-name">Shift + Home selects from focused to start</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 20 → focused = 20</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Home</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[0,20]</span></span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-034</span>
            <span className="tc-name">Shift + End selects from focused to end</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 10 → focused = 10 (totalItems = 48)</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + End</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10,47]</span></span></div>
          </div>
        </div>
      </div>

      {/* TC Group 7: Edge Cases */}
      <div className="tc-group">
        <h3 className="tc-group-title">
          <span className="tc-tag tc-edge">Edge Case</span>
          Edge Cases and Boundary Conditions
        </h3>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-035</span>
            <span className="tc-name">Shift+Click with no focused item (nothing clicked yet)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Fresh state — no interactions yet, focused = null</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10]</span> — treats clicked item as both anchor and endpoint</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-036</span>
            <span className="tc-name">Shift+Click same item as focused</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 10 → focused = 10</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + Click item 10</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[10]</span> — range of length 1</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-037</span>
            <span className="tc-name">Shift+Arrow at boundary (first item)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click item 0 → focused = 0</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + ArrowUp</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[0]</span> — cannot go below 0, no crash</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-038</span>
            <span className="tc-name">Shift+Arrow at boundary (last item)</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Precondition</span><span>Click last item → focused = totalItems - 1</span></div>
            <div className="tc-row"><span className="tc-label">Action</span><span>Shift + ArrowDown</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">selection = <span className="range">[last]</span> — cannot exceed total, no crash</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-039</span>
            <span className="tc-name">Rapid Click → Shift → Click → Shift sequence</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Actions</span><span>Click 5 → Shift+Click 10 → Click 20 → Shift+Click 25</span></div>
            <div className="tc-row"><span className="tc-label">After Click 5</span><span className="tc-expected"><span className="range">[5]</span></span></div>
            <div className="tc-row"><span className="tc-label">After Shift+10</span><span className="tc-expected"><span className="range">[5,10]</span></span></div>
            <div className="tc-row"><span className="tc-label">After Click 20</span><span className="tc-expected"><span className="range">[5,10]</span> + <span className="range">[20]</span> — click adds, preserves existing</span></div>
            <div className="tc-row"><span className="tc-label">After Shift+25</span><span className="tc-expected"><span className="range">[20,25]</span> — Shift replaces all with one range from focused (20)</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-040</span>
            <span className="tc-name">Selection works across all view types</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Validation</span><span>Repeat TC-001 through TC-027 on each view type:</span></div>
            <div className="tc-checklist">
              <label><input type="checkbox" /> Tile View — items are tiles</label>
              <label><input type="checkbox" /> List View — items are rows with checkboxes</label>
              <label><input type="checkbox" /> Grid Row View — items are table rows</label>
              <label><input type="checkbox" /> Grid Column View — items are column headers</label>
            </div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">Identical behavior across all views — same hook, same results</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-041</span>
            <span className="tc-name">List view checkboxes stay in sync with selection state</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Action</span><span>Use any combination of Click, Shift, Ctrl interactions on list rows</span></div>
            <div className="tc-row"><span className="tc-label">Expected</span><span className="tc-expected">Checkbox checked state matches isSelected() for every row at all times</span></div>
          </div>
        </div>

        <div className="tc-card">
          <div className="tc-header">
            <span className="tc-id">TC-042</span>
            <span className="tc-name">Select All checkbox in list view</span>
          </div>
          <div className="tc-body">
            <div className="tc-row"><span className="tc-label">Action A</span><span>Click header checkbox when nothing selected</span></div>
            <div className="tc-row"><span className="tc-label">Expected A</span><span className="tc-expected">All items selected, header checkbox checked</span></div>
            <div className="tc-row"><span className="tc-label">Action B</span><span>Click header checkbox when all selected</span></div>
            <div className="tc-row"><span className="tc-label">Expected B</span><span className="tc-expected">All items deselected, header checkbox unchecked</span></div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="tc-summary">
        <h3>Summary</h3>
        <div className="tc-summary-grid">
          <div className="tc-summary-item">
            <span className="tc-summary-count">8</span>
            <span className="tc-summary-label">Plain Click</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">7</span>
            <span className="tc-summary-label">Ctrl/Cmd + Click</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">7</span>
            <span className="tc-summary-label">Shift + Click</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">3</span>
            <span className="tc-summary-label">Shift Release</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">5</span>
            <span className="tc-summary-label">Ctrl + Shift</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">7</span>
            <span className="tc-summary-label">Keyboard</span>
          </div>
          <div className="tc-summary-item">
            <span className="tc-summary-count">8</span>
            <span className="tc-summary-label">Edge Cases</span>
          </div>
          <div className="tc-summary-item tc-summary-total">
            <span className="tc-summary-count">45</span>
            <span className="tc-summary-label">Total Test Cases</span>
          </div>
        </div>
      </div>
    </div>
  );
}
