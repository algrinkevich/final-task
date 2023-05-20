import "./button.styles.scss"

export enum ButtonType {
  BASE = "base",
  BASE_WHITE = "base-white",
}

const Button = ({
  buttonType = ButtonType.BASE,
  children = null,
  ...otherProps
}: {
  buttonType?: ButtonType
  children?: React.ReactNode
}) => {
  return (
    <button className={`button-container ${buttonType}`} {...otherProps}>
      {children}
    </button>
  )
}

export default Button
