interface TextComposerProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextComposer({
  id,
  label,
  placeholder,
  value,
  onChange,
}: TextComposerProps) {
  return (
    <div className="composer">
      <div className="composer-heading">
        <label htmlFor={id}>{label}</label>
        {value.length > 0 && (
          <button className="text-button" type="button" onClick={() => onChange("")}>
            전체 삭제
          </button>
        )}
      </div>
      <textarea
        id={id}
        maxLength={500}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className="char-count" aria-live="polite">
        <strong>{value.length}</strong> / 500
      </span>
    </div>
  );
}
