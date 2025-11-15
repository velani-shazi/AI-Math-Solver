import './FormInput.css';

export default function FormInput({ 
  label, 
  type, 
  value, 
  onChange, 
  placeholder, 
  icon, 
  rightButton 
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
        />
        {rightButton && (
          <button
            type="button"
            onClick={rightButton.onClick}
            className="toggle-password"
          >
            {rightButton.icon}
          </button>
        )}
      </div>
    </div>
  );
}