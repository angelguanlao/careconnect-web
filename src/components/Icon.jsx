// Thin wrapper around an <svg><use> reference into the sprite.
// Decorative by default (aria-hidden); pass a `title` to give it an accessible
// name when the icon carries meaning on its own.
export default function Icon({ id, size = 18, title }) {
  return (
    <svg
      width={size}
      height={size}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <use href={`#i-${id}`} />
    </svg>
  );
}
