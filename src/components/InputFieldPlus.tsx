import { FieldError } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  isRequired?: boolean;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  money?: boolean;
};

const InputField = ({
  label,
  type = "text",
  register,
  isRequired,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  money,
}: InputFieldProps) => {
  return (
    <div className={hidden ? "hidden" : "w-full"}>
      {/* Container com borda e arredondamento */}
      <div className="border border-gray-300 rounded-md">
        {/* Label posicionado acima com linha inferior */}
        <label className="block px-2 pt-1 text-xs font-medium text-gray-600 border-b border-gray-300">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        {/* Área do input */}
        <div className="px-2 py-1">
          {money ? (
            <NumericFormat
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix="R$ "
             
              onValueChange={(values) => {
                // Se estiver utilizando react-hook-form, atualize o valor via onChange do register
                if (register && register(name) && register(name).onChange) {
                  register(name).onChange(values.floatValue?.toString() || "");
                }
              }}
              className="w-full bg-transparent text-sm focus:outline-none"
              {...inputProps}
            />
          ) : (
            <input
              type={type}
              required={isRequired}
              {...register(name)}
              defaultValue={defaultValue}
              className="w-full bg-transparent text-sm focus:outline-none"
              {...inputProps}
            />
          )}
        </div>
      </div>
      {error?.message && (
        <p className="text-xs text-red-500 mt-1">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
