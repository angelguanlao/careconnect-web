// Accessible switch: a real checkbox with role="switch" + aria-checked, styled
// as a track/thumb. 44px hit area preserved by the surrounding label.
export default function Toggle({ id, checked, label, onChange }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="track"><span className="thumb" /></span>
    </label>
  );
}
