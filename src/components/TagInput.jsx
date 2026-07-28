import { useRef } from 'react';

// Token/tag input for the profile allergies field. Type + Enter (or comma) to
// add; click ✕ or Backspace-on-empty to remove. A <datalist> feeds suggestions.
export default function TagInput({ id, label, tags, setTags, suggestions = [] }) {
  const inputRef = useRef(null);
  const listId = `${id}-list`;

  const add = (raw) => {
    const v = raw.replace(/,/g, '').trim();
    if (v && !tags.some((t) => t.toLowerCase() === v.toLowerCase())) setTags([...tags, v]);
    if (inputRef.current) inputRef.current.value = '';
  };
  const removeAt = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(e.currentTarget.value);
    } else if (e.key === 'Backspace' && !e.currentTarget.value && tags.length) {
      removeAt(tags.length - 1);
    }
  };

  return (
    <>
      <div className="tag-input">
        <ul className="tag-list" style={{ listStyle: 'none', display: 'contents' }} aria-label="Added tags">
          {tags.map((t, i) => (
            <li className="tag" key={t}>
              <span>{t}</span>
              <button type="button" className="tag-x" aria-label={`Remove ${t}`} onClick={() => removeAt(i)}>×</button>
            </li>
          ))}
        </ul>
        <input
          ref={inputRef}
          className="tag-field"
          type="text"
          id={id}
          list={listId}
          aria-label={label}
          autoComplete="off"
          placeholder={tags.length ? 'Add another…' : 'Type and press Enter…'}
          onKeyDown={onKeyDown}
          onBlur={(e) => { if (e.target.value.trim()) add(e.target.value); }}
        />
      </div>
      <datalist id={listId}>
        {suggestions.map((s) => <option value={s} key={s} />)}
      </datalist>
    </>
  );
}
