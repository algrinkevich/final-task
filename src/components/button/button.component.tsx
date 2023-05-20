import "./button.styles.scss"

export enum ButtonType {
  BASE = "base",
  INITIAL_WHITE = "initial-white",
  INITIAL_BLUE = "initial-blue",
}

interface ButtonProps {
  buttonType: ButtonType
  children: React.ReactNode
  styleClasses?: string
}

const Button = ({
  buttonType = ButtonType.BASE,
  children = null,
  styleClasses,
}: ButtonProps) => {
  return (
    <button className={`button-container ${buttonType} ${styleClasses || ""}`}>
      {children}
    </button>
  )
}

export default Button
