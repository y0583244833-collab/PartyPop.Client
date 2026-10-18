export function Loading({ text = 'טוען...' }: { text?: string }) {
  return <div className="loading" role="status"><span className="spinner" /> {text}</div>;
}
