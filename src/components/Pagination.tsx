interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination">
      <button className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>הקודם</button>
      <span>עמוד {page} מתוך {totalPages}</span>
      <button className="btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>הבא</button>
    </nav>
  );
}
