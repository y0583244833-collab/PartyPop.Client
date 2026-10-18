import type { ApiError } from '../api/client';

/**
 * 409 Conflict: השרת אומר שהמשאב נתפס. שני מקרים:
 * 1. אין מספיק יחידות → השרת שולח unavailableItems, ומציגים טבלה מה חסר.
 * 2. התנגשות concurrency (מישהו שמר רגע לפנינו) → אין רשימה, ומציעים לנסות שוב.
 * 3. 409 אחר (שם קטגוריה קיים, קטגוריה עם מוצרים) → רק ההודעה מהשרת.
 */
export function ConflictAlert({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  const items = error.body.unavailableItems;

  return (
    <div className="alert alert-conflict" role="alert">
      <div className="conflict-title">⚠️ {error.message}</div>

      {items && items.length > 0 ? (
        <>
          <p>ההזמנה לא נקלטה, והסל נשאר כמו שהוא. אפשר להקטין כמות, להסיר פריט או לבחור תאריך אחר:</p>
          <table className="table">
            <thead>
              <tr><th>מוצר</th><th>ביקשת</th><th>זמין כרגע</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.cartItemId}>
                  <td>{item.productName}</td>
                  <td>{item.requested}</td>
                  <td className="danger">{item.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : onRetry ? (
        // התנגשות concurrency באישור הזמנה: אפשר לנסות שוב
        <>
          <p>מישהו אחר שמר שינוי באותו רגע. שום דבר לא אבד, אפשר פשוט לנסות שוב.</p>
          <button className="btn" onClick={onRetry}>לנסות שוב</button>
        </>
      ) : null}
    </div>
  );
}
