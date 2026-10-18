export const formatPrice = (value: number) => `₪${value.toLocaleString('he-IL', { maximumFractionDigits: 2 })}`;

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('he-IL');

/** מחר בפורמט yyyy-MM-dd, לשדה date. */
export const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};
