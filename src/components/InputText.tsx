interface InputTextProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputText({
  label,
  id,
  value,
  onChange,
}: InputTextProps) {
  return (
    <div className="text-2xl mb-4 flex gap-2 items-center">
      <label>{label}:</label>
      <input
        className="border-2 text-xl px-2 border-[var(--blue)] w-full rounded-md"
        type="text"
        id={id}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
