import { useState, useCallback, useRef, useEffect } from "react";

export interface SelectionRange {
  start: number;
  end: number;
}

export interface SelectionState {
  ranges: SelectionRange[];
  focusedIndex: number | null;
  shiftAnchorIndex: number | null;
}

export type ClickMode = "toggle" | "standard";

export interface UseRangeSelectionOptions {
  totalItems: number;
  clickMode?: ClickMode;
  onSelectionChange?: (selectedIndices: Set<number>) => void;
}

function normalizeRange(a: number, b: number): SelectionRange {
  return { start: Math.min(a, b), end: Math.max(a, b) };
}

function rangesOverlapOrAdjacent(a: SelectionRange, b: SelectionRange): boolean {
  return a.start <= b.end + 1 && b.start <= a.end + 1;
}

function mergeRanges(ranges: SelectionRange[]): SelectionRange[] {
  if (ranges.length <= 1) return ranges;
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: SelectionRange[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (rangesOverlapOrAdjacent(last, sorted[i])) {
      last.end = Math.max(last.end, sorted[i].end);
    } else {
      merged.push(sorted[i]);
    }
  }
  return merged;
}

function isIndexInRanges(index: number, ranges: SelectionRange[]): boolean {
  return ranges.some((r) => index >= r.start && index <= r.end);
}

function addIndexToRanges(index: number, ranges: SelectionRange[]): SelectionRange[] {
  return mergeRanges([...ranges, { start: index, end: index }]);
}

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

function rangesToSet(ranges: SelectionRange[]): Set<number> {
  const set = new Set<number>();
  for (const r of ranges) {
    for (let i = r.start; i <= r.end; i++) set.add(i);
  }
  return set;
}

export function useRangeSelection({ totalItems, clickMode = "toggle", onSelectionChange }: UseRangeSelectionOptions) {
  const [state, setState] = useState<SelectionState>({
    ranges: [],
    focusedIndex: null,
    shiftAnchorIndex: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const notifyChange = useCallback((ranges: SelectionRange[]) => {
    onSelectionChangeRef.current?.(rangesToSet(ranges));
  }, []);

  const handleClick = useCallback(
    (index: number) => {
      const prev = stateRef.current;
      if (clickMode === "standard") {
        const newRanges = [{ start: index, end: index }];
        const newState = { ranges: newRanges, focusedIndex: index, shiftAnchorIndex: null };
        setState(newState);
        notifyChange(newRanges);
      } else {
        const selected = isIndexInRanges(index, prev.ranges);
        const newRanges = selected
          ? removeIndexFromRanges(index, prev.ranges)
          : addIndexToRanges(index, prev.ranges);
        setState({ ranges: newRanges, focusedIndex: index, shiftAnchorIndex: null });
        notifyChange(newRanges);
      }
    },
    [notifyChange, clickMode]
  );

  const handleCtrlClick = useCallback(
    (index: number) => {
      const prev = stateRef.current;
      const selected = isIndexInRanges(index, prev.ranges);
      const newRanges = selected
        ? removeIndexFromRanges(index, prev.ranges)
        : addIndexToRanges(index, prev.ranges);
      setState({ ranges: newRanges, focusedIndex: index, shiftAnchorIndex: null });
      notifyChange(newRanges);
    },
    [notifyChange]
  );

  const handleShiftClick = useCallback(
    (index: number) => {
      const prev = stateRef.current;
      const anchor = prev.shiftAnchorIndex ?? prev.focusedIndex ?? index;
      const newRange = normalizeRange(anchor, index);
      const newRanges = [newRange];
      setState({ ranges: newRanges, focusedIndex: index, shiftAnchorIndex: anchor });
      notifyChange(newRanges);
    },
    [notifyChange]
  );

  const handleCtrlShiftClick = useCallback(
    (index: number) => {
      const prev = stateRef.current;
      const anchor = prev.shiftAnchorIndex ?? prev.focusedIndex ?? index;
      const newRange = normalizeRange(anchor, index);
      const newRanges = mergeRanges([...prev.ranges, newRange]);
      setState({ ranges: newRanges, focusedIndex: index, shiftAnchorIndex: anchor });
      notifyChange(newRanges);
    },
    [notifyChange]
  );

  const handleItemInteraction = useCallback(
    (index: number, event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      if (isCtrl && isShift) {
        handleCtrlShiftClick(index);
      } else if (isShift) {
        handleShiftClick(index);
      } else if (isCtrl) {
        handleCtrlClick(index);
      } else {
        handleClick(index);
      }
    },
    [handleClick, handleCtrlClick, handleShiftClick, handleCtrlShiftClick]
  );

  const handleShiftRelease = useCallback(() => {
    setState((prev) => ({
      ...prev,
      shiftAnchorIndex: null,
    }));
  }, []);

  const selectAll = useCallback(() => {
    const newRanges = [{ start: 0, end: totalItems - 1 }];
    setState((prev) => ({ ...prev, ranges: newRanges }));
    notifyChange(newRanges);
  }, [totalItems, notifyChange]);

  const clearSelection = useCallback(() => {
    setState({ ranges: [], focusedIndex: null, shiftAnchorIndex: null });
    notifyChange([]);
  }, [notifyChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const current = stateRef.current;

      // Ctrl+A → select all
      if (isCtrl && e.key === "a") {
        e.preventDefault();
        selectAll();
        return;
      }

      // Escape → clear
      if (e.key === "Escape") {
        clearSelection();
        return;
      }

      // Enter / Space → act on focused item (keyboard equivalent of clicking)
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (current.focusedIndex == null) return;
        const idx = current.focusedIndex;

        if (isCtrl && isShift) {
          // Ctrl+Shift+Enter → additive range (like Ctrl+Shift+Click)
          handleCtrlShiftClick(idx);
        } else if (isShift) {
          // Shift+Enter → range from anchor to focused (like Shift+Click)
          handleShiftClick(idx);
        } else if (isCtrl) {
          // Ctrl+Enter → toggle without clearing (like Ctrl+Click)
          handleCtrlClick(idx);
        } else {
          // Enter → click on focused (respects clickMode)
          handleClick(idx);
        }
        return;
      }

      // Arrow Down / Right
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(
          (current.focusedIndex ?? -1) + 1,
          totalItems - 1
        );

        if (isCtrl && isShift) {
          // Ctrl+Shift+Arrow → extend range additively
          const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? next;
          const newRange = normalizeRange(anchor, next);
          const newRanges = mergeRanges([...current.ranges, newRange]);
          setState({ ranges: newRanges, focusedIndex: next, shiftAnchorIndex: anchor });
          notifyChange(newRanges);
        } else if (isShift) {
          // Shift+Arrow → extend/create range
          const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? next;
          const newRange = normalizeRange(anchor, next);
          setState({ ranges: [newRange], focusedIndex: next, shiftAnchorIndex: anchor });
          notifyChange([newRange]);
        } else if (isCtrl) {
          setState((prev) => ({ ...prev, focusedIndex: next, shiftAnchorIndex: null }));
        } else {
          setState((prev) => ({ ...prev, focusedIndex: next, shiftAnchorIndex: null }));
        }
        return;
      }

      // Arrow Up / Left
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max((current.focusedIndex ?? totalItems) - 1, 0);

        if (isCtrl && isShift) {
          const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? prev;
          const newRange = normalizeRange(anchor, prev);
          const newRanges = mergeRanges([...current.ranges, newRange]);
          setState({ ranges: newRanges, focusedIndex: prev, shiftAnchorIndex: anchor });
          notifyChange(newRanges);
        } else if (isShift) {
          const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? prev;
          const newRange = normalizeRange(anchor, prev);
          setState({ ranges: [newRange], focusedIndex: prev, shiftAnchorIndex: anchor });
          notifyChange([newRange]);
        } else {
          setState((prev_state) => ({ ...prev_state, focusedIndex: prev, shiftAnchorIndex: null }));
        }
        return;
      }

      // Shift+Home → select from focused to first
      if (e.key === "Home" && isShift) {
        e.preventDefault();
        const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? 0;
        const newRange = normalizeRange(0, anchor);
        setState({ ranges: [newRange], focusedIndex: 0, shiftAnchorIndex: anchor });
        notifyChange([newRange]);
        return;
      }

      // Home → jump focus to first
      if (e.key === "Home") {
        e.preventDefault();
        setState((prev) => ({ ...prev, focusedIndex: 0, shiftAnchorIndex: null }));
        return;
      }

      // Shift+End → select from focused to last
      if (e.key === "End" && isShift) {
        e.preventDefault();
        const anchor = current.shiftAnchorIndex ?? current.focusedIndex ?? 0;
        const newRange = normalizeRange(anchor, totalItems - 1);
        setState({ ranges: [newRange], focusedIndex: totalItems - 1, shiftAnchorIndex: anchor });
        notifyChange([newRange]);
        return;
      }

      // End → jump focus to last
      if (e.key === "End") {
        e.preventDefault();
        setState((prev) => ({ ...prev, focusedIndex: totalItems - 1, shiftAnchorIndex: null }));
        return;
      }
    },
    [totalItems, selectAll, clearSelection, notifyChange, handleClick, handleCtrlClick, handleShiftClick, handleCtrlShiftClick]
  );

  const isSelected = useCallback(
    (index: number) => isIndexInRanges(index, state.ranges),
    [state.ranges]
  );

  const isFocused = useCallback(
    (index: number) => state.focusedIndex === index,
    [state.focusedIndex]
  );

  const getSelectedIndices = useCallback(
    () => rangesToSet(state.ranges),
    [state.ranges]
  );

  const getSelectedCount = useCallback(() => {
    let count = 0;
    for (const r of state.ranges) count += r.end - r.start + 1;
    return count;
  }, [state.ranges]);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") handleShiftRelease();
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [handleShiftRelease]);

  return {
    state,
    handleItemInteraction,
    handleKeyDown,
    isSelected,
    isFocused,
    selectAll,
    clearSelection,
    getSelectedIndices,
    getSelectedCount,
  };
}
