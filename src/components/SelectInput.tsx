import { FieldError } from "react-hook-form";

type Option = {
  value: string;
  label: string;
};

type SelectInputProps = {
  label?: string;
  register: any;
  name: string;
  defaultValue?: string;
  isRequired?: boolean;
  error?: FieldError;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  options: Option[];
};

const SelectInput = ({
  label,
  register,
  name,
  defaultValue,
  error,
  isRequired,
  selectProps,
  options,
}: SelectInputProps) => {
  return (
    <div className="flex flex-col gap-2 px-4">
      {label && (
        <label className="text-xs text-gray-500">
          {label}{" "}
          {isRequired && <span className="text-red-500 text-lg">*</span>}
        </label>
      )}

      <select
        {...register(name)}
        defaultValue={defaultValue}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...selectProps}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error?.message && (
        <p className="text-xs text-red-500 py-0">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default SelectInput;
