import { ComponentProps, Fragment } from "react";

import "./form-input.styles.scss";

interface FormInputProps extends ComponentProps<"input"> {
  type: string;
  placeholder: string;
  title?: string;
  id: string;
  name: string;
  styleClasses?: string;
  validate?: (value: string) => string | undefined;
}

const FormInput = ({
  type,
  placeholder,
  title,
  id,
  name,
  styleClasses,
  ...rest
}: FormInputProps) => {
  return (
    <Fragment>
      {title && (
        <label htmlFor={id} className="input-title">
          {title}
        </label>
      )}
      <input
        type={type}
        className={`${styleClasses || ""} input-field`}
        id={id}
        name={name}
        placeholder={placeholder}
        {...rest}
      />
    </Fragment>
  );
};

export default FormInput;
