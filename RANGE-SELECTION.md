# Range Selection Pattern — Developer Implementation Guide

## Overview

A framework-agnostic selection pattern for building multi-select interactions across any list-like UI. Follows the same mental model as Windows Explorer, macOS Finder, Google Drive, Google Sheets, and enterprise data grids (AG Grid, DevExpress, Telerik).

This document covers:

1. [Internal State Model](#1-internal-state-model)
2. [Click Modes](#2-click-modes)
3. [Interaction Rules](#3-interaction-rules)
4. [Algorithm (Pseudocode)](#4-algorithm-pseudocode)
5. [Keyboard Support](#5-keyboard-support)
6. [Visual States](#6-visual-states)
7. [Hook API Reference](#7-hook-api-reference)
8. [Usage Examples](#8-usage-examples)
9. [View Type Matrix](#9-view-type-matrix)
10. [Common Pitfalls](#10-common-pitfalls)

---

## 1. Internal State Model

The system maintains **three separate states**. Getting this right is the foundation — most broken implementations fail because they conflate these.

```
┌─────────────────────┬──────────────────────────────────────────────────┐
│ State               │ Purpose                                          │
├─────────────────────┼──────────────────────────────────────────────────┤
│ selectionRanges     │ What is currently selected (array of ranges)     │
│ focusedIndex        │ Last interacted item — Shift starts from here    │
│ shiftAnchorIndex    │ Temporary pin while Shift is held                │
└─────────────────────┴──────────────────────────────────────────────────┘
```

### TypeScript types

```typescript
interface SelectionRange {
  start: number;  // inclusive
  end: number;    // inclusive, always >= start
}

interface SelectionState {
  ranges: SelectionRange[];
  focusedIndex: number | null;
  shiftAnchorIndex: number | null;
}
```

### Why three states?

- **Selection** = what is highlighted. Can be multiple disconnected ranges.
- **Focused** = the last item the user interacted with. This is where the *next* Shift interaction will anchor from. It is NOT the same as selected — an item can be focused but not selected, or selected but not focused.
- **Shift Anchor** = a temporary pin that exists only while Shift is held. It locks one end of the range so the other end can move freely. It is cleared when Shift is released.

If you merge any two of these into one, multi-step interactions break. Example: select a range, release Shift, Shift-click again — without a separate anchor, the second range starts from the wrong place.

---

## 2. Click Modes

The hook supports two click modes. Choose based on the UI type.

```
┌───────────┬────────────────────────────────────────┬──────────────────────────┐
│ Mode      │ Plain Click Behavior                   │ Use When                 │
├───────────┼────────────────────────────────────────┼──────────────────────────┤
│ "toggle"  │ Add or remove the clicked item.        │ Tile View, List View,    │
│           │ Existing selection preserved.           │ Card View, Tree View,    │
│           │ Same as Ctrl+Click.                    │ any checkbox UI          │
├───────────┼────────────────────────────────────────┼──────────────────────────┤
│ "standard"│ Clear everything, select only           │ Grid Rows (no checkbox), │
│           │ the clicked item. Ctrl+Click to        │ Grid Columns, Chart      │
│           │ toggle.                                │ X-Axis, data grids       │
└───────────┴────────────────────────────────────────┴──────────────────────────┘
```

**Rule of thumb:** If the view has checkboxes or the items look individually "tappable" (cards, tiles), use `toggle`. If the view is a data grid or spreadsheet where click means "focus on this one," use `standard`.

---

## 3. Interaction Rules

### 3.1 Click (toggle mode)

```
Action:  Toggle clicked item in selection. Preserve everything else.
State:   focusedIndex = clickedIndex
         shiftAnchorIndex = null

Example: selection = [5,10], Click 20  →  [5,10] + [20]
Example: selection = [5,15], Click 10  →  [5,9] + [11,15]
```

### 3.2 Click (standard mode)

```
Action:  Clear all selection. Select only clicked item.
State:   focusedIndex = clickedIndex
         shiftAnchorIndex = null

Example: selection = [5,15], Click 20  →  [20]
```

### 3.3 Ctrl/Cmd + Click (both modes)

```
Action:  Toggle clicked item. Preserve existing selection.
State:   focusedIndex = clickedIndex
         shiftAnchorIndex = null

Example: selection = [5,15], Ctrl+Click 25  →  [5,15] + [25]
Example: selection = [5,15], Ctrl+Click 10  →  [5,9] + [11,15]
```

### 3.4 Shift + Click

```
Action:  Create ONE continuous range from anchor to clicked index.
         Replaces entire selection with this one range.
State:   if shiftAnchorIndex is null → shiftAnchorIndex = focusedIndex
         focusedIndex = clickedIndex

Example: Click 5, Shift+Click 15  →  [5,15], anchor = 5
```

### 3.5 Continuous Shift (hold Shift, click multiple times)

```
Action:  Anchor stays fixed. Only the endpoint changes.

Example: Click 5, Shift+15, Shift+13, Shift+19
         After Shift+15  →  [5,15]
         After Shift+13  →  [5,13]   (items 14–15 deselected)
         After Shift+19  →  [5,19]   (anchor remains 5)
```

### 3.6 Shift Release

```
Action:  Clear shiftAnchorIndex. Selection and focusedIndex stay.

Before:  selection = [5,19], focused = 19, anchor = 5
After:   selection = [5,19], focused = 19, anchor = null
```

### 3.7 New Shift After Release

```
Action:  Next Shift+Click anchors from focusedIndex (not old anchor).

Example: Click 22, Shift+27, Release, Shift+5
         → anchor = 27, selection = [5,27]
         NOT: anchor = 22
```

### 3.8 Ctrl/Cmd + Shift + Click

```
Action:  Add another continuous range while PRESERVING existing selection.
State:   if shiftAnchorIndex is null → shiftAnchorIndex = focusedIndex
         Merge new range with existing ranges.
         focusedIndex = clickedIndex

Example: selection = [5,15], focused = 20, Ctrl+Shift+Click 25
         → [5,15] + [20,25]
```

### 3.9 Range Merge

```
Rule:    Overlapping or adjacent ranges merge automatically.

Example: [5,15] + new range [10,25]  →  [5,25]
         NOT: [5,15] + [10,25]
```

### Key difference: Shift vs Ctrl+Shift

| Interaction         | Behavior                                    |
|---------------------|---------------------------------------------|
| Shift + Click       | Replace entire selection with one range      |
| Ctrl + Shift + Click| Add another range, preserve existing         |

---

## 4. Algorithm (Pseudocode)

```
CLICK (toggle mode)
─────────────────────
  if item is selected → remove from selection
  if item is unselected → add to selection
  focusedIndex = clickedIndex
  shiftAnchorIndex = null

CLICK (standard mode)
─────────────────────
  selection = [clickedIndex]
  focusedIndex = clickedIndex
  shiftAnchorIndex = null

CTRL/CMD + CLICK
─────────────────────
  if item is selected → remove from selection
  if item is unselected → add to selection
  focusedIndex = clickedIndex
  shiftAnchorIndex = null

SHIFT + CLICK
─────────────────────
  if shiftAnchorIndex == null:
    shiftAnchorIndex = focusedIndex
  selection = [range(shiftAnchorIndex → clickedIndex)]
  focusedIndex = clickedIndex

CTRL/CMD + SHIFT + CLICK
─────────────────────
  if shiftAnchorIndex == null:
    shiftAnchorIndex = focusedIndex
  newRange = range(shiftAnchorIndex → clickedIndex)
  selection = merge(existingSelection, newRange)
  focusedIndex = clickedIndex

SHIFT KEY RELEASED
─────────────────────
  shiftAnchorIndex = null
```

---

## 5. Keyboard Support

Every mouse interaction has a keyboard equivalent. The same modifier logic applies: plain = click, Ctrl = Ctrl+Click, Shift = Shift+Click, Ctrl+Shift = Ctrl+Shift+Click.

### Navigation

| Key                      | Action                                        | Mouse Equivalent     |
|--------------------------|-----------------------------------------------|----------------------|
| `Arrow ↑↓←→`            | Move focus and select that item               | Click                |
| `Ctrl + Arrow`           | Move focus only (no selection change)         | —                    |
| `Home`                   | Jump focus to first item                      | —                    |
| `End`                    | Jump focus to last item                       | —                    |

### Selection via Enter/Space (act on focused item)

| Key                      | Action                                        | Mouse Equivalent     |
|--------------------------|-----------------------------------------------|----------------------|
| `Enter` / `Space`        | Toggle/select the focused item                | Click                |
| `Ctrl + Enter`           | Toggle focused item, preserve rest            | Ctrl + Click         |
| `Shift + Enter`          | Range from anchor to focused                  | Shift + Click        |
| `Ctrl + Shift + Enter`   | Add range while preserving existing           | Ctrl + Shift + Click |

### Selection via Arrow Keys

| Key                      | Action                                        | Mouse Equivalent     |
|--------------------------|-----------------------------------------------|----------------------|
| `Shift + Arrow`          | Extend/shrink selection range one item        | Shift + Click        |
| `Ctrl + Shift + Arrow`   | Extend range additively (preserve existing)   | Ctrl + Shift + Click |
| `Shift + Home`           | Select from focused to first item             | —                    |
| `Shift + End`            | Select from focused to last item              | —                    |

### Utility

| Key                      | Action                                        |
|--------------------------|-----------------------------------------------|
| `Ctrl/Cmd + A`           | Select all items                              |
| `Escape`                 | Clear all selection                           |

### Keyboard workflow example

```
1. Arrow Down × 5        → focus moves to item 5, item 5 selected
2. Ctrl + Arrow Down × 3 → focus moves to item 8, selection unchanged (still item 5)
3. Ctrl + Enter           → toggle item 8 into selection → [5] + [8]
4. Ctrl + Arrow Down × 2 → focus moves to item 10, selection unchanged
5. Ctrl + Shift + Enter   → add range [8,10] to selection → [5] + [8,10]
6. Shift + Arrow Down × 3 → extend range to [5] + [8,13]
```

This is the keyboard-only way to build disconnected multi-ranges — essential for accessibility.

---

## 6. Visual States

Implement four distinct visual states. **Focused and selected are separate concepts.**

```
┌──────────────────┬──────────────────────────────────────────────┐
│ State            │ Visual Treatment                             │
├──────────────────┼──────────────────────────────────────────────┤
│ Default          │ Normal appearance                            │
│ Hover            │ Subtle background change                     │
│ Selected         │ Filled background + accent border            │
│ Focused          │ Focus ring / inset border / dotted outline   │
│ Selected+Focused │ Both treatments combined                     │
└──────────────────┴──────────────────────────────────────────────┘
```

CSS example:

```css
.item          { background: var(--bg-surface); border: 1px solid var(--border); }
.item:hover    { background: var(--bg-hover); }
.item.selected { background: rgba(99, 102, 241, 0.12); border-color: rgba(99, 102, 241, 0.4); }
.item.focused  { box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.6); }
```

---

## 7. Hook API Reference

### `useRangeSelection(options)`

```typescript
function useRangeSelection(options: UseRangeSelectionOptions): {
  state: SelectionState;
  handleItemInteraction: (index: number, event: ModifierEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  isSelected: (index: number) => boolean;
  isFocused: (index: number) => boolean;
  selectAll: () => void;
  clearSelection: () => void;
  getSelectedIndices: () => Set<number>;
  getSelectedCount: () => number;
};
```

### Options

```typescript
interface UseRangeSelectionOptions {
  totalItems: number;               // Total number of selectable items
  clickMode?: "toggle" | "standard"; // Default: "toggle"
  onSelectionChange?: (selected: Set<number>) => void;  // Callback on change
}
```

### Return values

| Property                | Type                      | Description                                      |
|-------------------------|---------------------------|--------------------------------------------------|
| `state`                 | `SelectionState`          | Current ranges, focusedIndex, shiftAnchorIndex   |
| `handleItemInteraction` | `(index, event) => void`  | Pass index + mouse event. Routes to correct handler based on modifier keys. |
| `handleKeyDown`         | `(e) => void`             | Attach to container's keydown listener           |
| `isSelected`            | `(index) => boolean`      | Check if an index is selected                    |
| `isFocused`             | `(index) => boolean`      | Check if an index is the focused item            |
| `selectAll`             | `() => void`              | Select all items                                 |
| `clearSelection`        | `() => void`              | Clear all selection                              |
| `getSelectedIndices`    | `() => Set<number>`       | Get all selected indices as a Set                |
| `getSelectedCount`      | `() => number`            | Get count of selected items                      |

---

## 8. Usage Examples

### Minimal example (any view)

```tsx
function MyList({ items }) {
  const containerRef = useRef(null);
  const {
    handleItemInteraction,
    handleKeyDown,
    isSelected,
    isFocused,
  } = useRangeSelection({
    totalItems: items.length,
    clickMode: "toggle",
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => handleKeyDown(e);
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [handleKeyDown]);

  return (
    <div ref={containerRef} tabIndex={0}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`item ${isSelected(i) ? "selected" : ""} ${isFocused(i) ? "focused" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            handleItemInteraction(i, e);
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

### With checkboxes

```tsx
<div className="row" onMouseDown={(e) => { e.preventDefault(); handleItemInteraction(i, e); }}>
  <input type="checkbox" checked={isSelected(i)} readOnly tabIndex={-1} />
  <span>{item.name}</span>
</div>
```

The checkbox is a **read-only visual indicator** — it reflects `isSelected()`. All click handling goes through `onMouseDown` on the row, not `onChange` on the checkbox. This ensures Shift+Click, Ctrl+Click etc. work correctly.

### With select-all checkbox

```tsx
const allSelected = getSelectedCount() === totalItems;

<input
  type="checkbox"
  checked={allSelected}
  onChange={() => (allSelected ? clearSelection() : selectAll())}
/>
```

### With selection callback

```tsx
useRangeSelection({
  totalItems: items.length,
  clickMode: "standard",
  onSelectionChange: (selectedIndices) => {
    const selectedItems = [...selectedIndices].map(i => items[i]);
    console.log("Selected:", selectedItems);
  },
});
```

---

## 9. View Type Matrix

| View Type             | Click Mode   | Checkboxes | Select-All | Use Case                        |
|-----------------------|-------------|------------|------------|----------------------------------|
| Tile View             | `toggle`    | No         | No         | Icon/thumbnail grid              |
| Card View             | `toggle`    | No         | No         | Kanban cards, project cards      |
| List View             | `toggle`    | Yes        | Yes        | File list, email inbox           |
| Tree View             | `toggle`    | Yes        | Yes        | File explorer, org chart         |
| Grid Rows (checkbox)  | `toggle`    | Yes        | Yes        | Data grid with bulk actions      |
| Grid Rows (no checkbox)| `standard` | No         | No         | Read-heavy data grid             |
| Grid Columns          | `standard`  | No         | No         | Spreadsheet column selection     |
| Chart X-Axis          | `standard`  | No         | No         | Date range, category selection   |

---

## 10. Common Pitfalls

### 1. Merging focus and selection into one state

**Wrong:** Using a single `selectedIndex` that doubles as the Shift anchor.

**Right:** Three separate states: `ranges`, `focusedIndex`, `shiftAnchorIndex`.

**What breaks:** User clicks item 5, Shift+clicks 15, releases Shift, then Shift+clicks 3. Without a separate anchor, the second range starts from 5 instead of 15.

### 2. Not clearing the anchor on Shift release

**Wrong:** Keeping `shiftAnchorIndex` forever.

**Right:** Clear it on `keyup` when Shift is released.

**What breaks:** User selects [5,15] with Shift, releases Shift, clicks item 20 (which resets focus), then Shift+clicks 25. If the anchor is still 5, they get [5,25] instead of [20,25].

### 3. Using `onClick` instead of `onMouseDown`

**Wrong:** `<div onClick={...}>` — fires after mouseup, and the browser may have already started text selection or other default behavior.

**Right:** `<div onMouseDown={(e) => { e.preventDefault(); handleItemInteraction(i, e); }}>` — fires immediately, and `preventDefault` stops text selection.

### 4. Side effects inside `setState` callback (React)

**Wrong:** Calling `notifyChange()` inside `setState((prev) => { ... })`. React StrictMode double-invokes the callback, causing toggle to flip on then off.

**Right:** Read current state from a ref (`stateRef.current`), compute new state, call `setState(newState)` and `notifyChange()` sequentially outside the callback.

### 5. Not supporting Ctrl+Shift+Click

**Wrong:** Treating `Shift+Click` and `Ctrl+Shift+Click` the same.

**Right:** `Shift+Click` replaces the entire selection with one range. `Ctrl+Shift+Click` adds a range while preserving existing selection.

**What breaks:** Power users can't build disconnected ranges. This is the most requested missing feature in custom data grids.

### 6. Not merging overlapping ranges

**Wrong:** Storing `[5,15] + [10,25]` as two separate ranges.

**Right:** Auto-merge to `[5,25]`.

**What breaks:** `getSelectedCount()` returns 27 instead of 21. `isSelected(12)` might need to check two ranges instead of one. Adjacent ranges like `[5,10] + [11]` should merge to `[5,11]`.

### 7. Handling checkbox `onChange` instead of row `onMouseDown`

**Wrong:** Putting the selection logic on the checkbox's `onChange` event.

**Right:** Put it on the row's `onMouseDown` and make the checkbox `readOnly`.

**What breaks:** Shift+Click on a checkbox doesn't give you the shift key state reliably across browsers. The row's `onMouseDown` always has the correct modifier key state.

---

## Internal Helper Functions

These utilities power the hook. If porting to a non-React framework, implement these first.

### `normalizeRange(a, b)`

Ensures `start <= end` regardless of selection direction.

```typescript
function normalizeRange(a: number, b: number): SelectionRange {
  return { start: Math.min(a, b), end: Math.max(a, b) };
}
```

### `mergeRanges(ranges)`

Sorts ranges by start, then merges any that overlap or are adjacent.

```typescript
function mergeRanges(ranges: SelectionRange[]): SelectionRange[] {
  if (ranges.length <= 1) return ranges;
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: SelectionRange[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (last.end + 1 >= sorted[i].start) {
      last.end = Math.max(last.end, sorted[i].end);
    } else {
      merged.push(sorted[i]);
    }
  }
  return merged;
}
```

### `isIndexInRanges(index, ranges)`

Returns true if the index falls within any range.

```typescript
function isIndexInRanges(index: number, ranges: SelectionRange[]): boolean {
  return ranges.some(r => index >= r.start && index <= r.end);
}
```

### `addIndexToRanges(index, ranges)`

Adds a single index and merges if adjacent.

```typescript
function addIndexToRanges(index: number, ranges: SelectionRange[]): SelectionRange[] {
  return mergeRanges([...ranges, { start: index, end: index }]);
}
```

### `removeIndexFromRanges(index, ranges)`

Removes a single index, splitting any range that contains it.

```typescript
function removeIndexFromRanges(index: number, ranges: SelectionRange[]): SelectionRange[] {
  const result: SelectionRange[] = [];
  for (const r of ranges) {
    if (index < r.start || index > r.end) {
      result.push(r);
    } else {
      if (r.start < index) result.push({ start: r.start, end: index - 1 });
      if (r.end > index) result.push({ start: index + 1, end: r.end });
    }
  }
  return result;
}
```

---

## Framework Portability

This pattern is framework-agnostic. The core logic is:

1. A state object with `ranges`, `focusedIndex`, `shiftAnchorIndex`
2. Five handler functions: `click`, `ctrlClick`, `shiftClick`, `ctrlShiftClick`, `shiftRelease`
3. Helper utilities for range math

To port to Vue, Svelte, Angular, or vanilla JS:

- Replace `useState` / `useRef` with your framework's reactivity primitives
- Attach `mousedown` (not click) handlers with `preventDefault()`
- Listen for `keyup` on window to detect Shift release
- Listen for `keydown` on the container for arrow keys, Ctrl+A, Escape

The interaction rules and algorithm stay exactly the same.
