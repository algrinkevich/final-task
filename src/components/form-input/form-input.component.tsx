import { ComponentProps, Fragment } from "react";
import { Field } from "formik";

import "./form-input.styles.scss";

interface FormInputProps extends ComponentProps<"input"> {
  type: string;
  placeholder: string;
  title: string;
  id: string;
  name: string;
  styleClasses?: string;
  validate?: (value: string) => string | undefined;
}

function validateEmail(value: string) {
  let error;

  if (!value) {
    error = "Required";
  } else if (!/^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  } else if (value.length >= 128) {
    error = "Email is too long";
  }

  return error;
}

function validatePassword(value: string) {
  let error;

  if (!value) {
    error = "Required";
  } else if (value.length < 6) {
    error = "Minimum number of characters should be 6";
  } else if (value.search(/[a-z]/) === -1) {
    error = "Should contain at least 1 character in lower case";
  } else if (value.search(/[A-Z]/) === -1) {
    error = "Should contain at least 1 character in upper case";
  } else if (value.search(/\d/) === -1) {
    error = "Should contain at least 1 number";
  }

  return error;
}

const FormInput = ({
  type,
  placeholder,
  title,
  id,
  name,
  styleClasses,
  validate,
  ...rest
}: FormInputProps) => {
  if (!validate) {
    validate = type === "email" ? validateEmail : validatePassword;
  }

  return (
    <Fragment>
      <label htmlFor={id} className="input-title">
        {title}
      </label>
      <Field
        type={type}
        className={`input-field ${styleClasses || ""}`}
        id={id}
        name={name}
        placeholder={placeholder}
        validate={validate}
        {...rest}
      />
    </Fragment>
  );
};

export default FormInput;
