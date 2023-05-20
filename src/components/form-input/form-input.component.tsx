import { Fragment, ComponentProps } from "react"

import "./form-input.styles.scss"

interface FormInputProps extends ComponentProps<"input"> {
  type: string
  placeholder: string
  title: string
  id: string
  name: string
  styleClasses?: string
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
      <label htmlFor={id} className="input-title">
        {title}
      </label>
      <input
        type={type}
        className={`input-field ${styleClasses || ""}`}
        id={id}
        name={name}
        placeholder={placeholder}
        {...rest}
      />
    </Fragment>
  )
}

export default FormInput
