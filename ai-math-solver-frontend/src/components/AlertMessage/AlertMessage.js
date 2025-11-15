import './AlertMessage.css';

export default function AlertMessage({ error, success }) {
  if (!error && !success) return null;

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </>
  );
}