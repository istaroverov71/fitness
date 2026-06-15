// ±  stepper — used for weight and reps input during workout
export default function Stepper({ value, onChange, step = 1, min = 0, max = 999, suffix = '' }) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)))
  const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)))

  return (
    <div className="stepper">
      <button onClick={dec} aria-label="уменьшить">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14" />
        </svg>
      </button>
      <span className="stepper-v">
        {value}{suffix && <small>{suffix}</small>}
      </span>
      <button onClick={inc} aria-label="увеличить">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
