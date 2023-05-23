import { ComponentProps } from "react";

import "./button.styles.scss";

export enum ButtonType {
  BASE = "base",
  INITIAL_WHITE = "initial-white",
  INITIAL_BLUE = "initial-blue",
  FILTERS = "filters-btn",
}

interface ButtonProps extends ComponentProps<"button"> {
  buttonType: ButtonType;
  children: React.ReactNode;
  styleClasses?: string;
}

const Button = ({
  buttonType = ButtonType.BASE,
  children = null,
  styleClasses,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`button-container ${buttonType} ${styleClasses || ""}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
