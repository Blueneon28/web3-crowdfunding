import { ChangeEvent, FC } from "react";

interface FormFieldProps {
  labelName?: string;
  placeholder: string;
  inputType?: "text" | "number" | "url" | "date";
  value: string | number | null;
  handleOnChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isTextArea?: boolean;
}

const FormField: FC<FormFieldProps> = ({
  labelName,
  placeholder,
  inputType,
  value,
  handleOnChange,
  isTextArea,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className="font-epilogue font-medium text-sm leading-6 text-[#808191] mb-3">
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value || ""}
          onChange={handleOnChange}
          rows={10}
          placeholder={placeholder}
          className="py-4 sm:px-6 px-4 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-sm placeholder:text-[#4b5264] rounded-xl sm:min-w-[300px]"
        />
      ) : (
        <input
          required
          type={inputType}
          value={value || ""}
          onChange={handleOnChange}
          step={"0.1"}
          placeholder={placeholder}
          className="py-4 sm:px-6 px-4 outline-none border border-[#3a3a43] bg-transparent font-epilogue text-white text-sm placeholder:text-[#4b5264] rounded-xl sm:min-w-[300px]"
        />
      )}
    </label>
  );
};

export default FormField;
