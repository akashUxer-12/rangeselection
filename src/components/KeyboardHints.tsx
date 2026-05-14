export function KeyboardHints() {
  return (
    <div className="kb-hints">
      <span className="kb-hint-label">Keyboard:</span>
      <kbd>↑↓</kbd> move focus
      <kbd>Space</kbd> select
      <kbd>Ctrl+Space</kbd> toggle
      <kbd>Shift+Space</kbd> range
      <kbd>Ctrl+Shift+Space</kbd> add range
      <kbd>Shift+↑↓</kbd> extend range
      <kbd>Ctrl+A</kbd> all
      <kbd>Esc</kbd> clear
    </div>
  );
}
