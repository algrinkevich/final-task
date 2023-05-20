import Button, { ButtonType } from "../../components/button/button.component"
import FormInput from "../../components/form-input/form-input.component"

import "./sign-up-form.styles.scss"

const SignUpForm = () => {
  return (
    <div className="sign-up-container">
      <h2 className="form-title">{"Sign up"}</h2>
      <FormInput
        type="email"
        id="email"
        name="email"
        placeholder="Enter your email"
        title="Email"
        styleClasses="sign-up-container__input"
        required
      />
      <FormInput
        type="password"
        id="password"
        name="password"
        placeholder="Enter your password"
        title="Password"
        styleClasses="sign-up-container__input"
        required
      />
      <FormInput
        type="password"
        id="confirm-password"
        name="confirm-password"
        placeholder="Enter your password again"
        title="Repeat Password"
        styleClasses="sign-up-container__input"
        required
      />
      <Button
        buttonType={ButtonType.INITIAL_BLUE}
        styleClasses="sign-up-container__button"
      >
        {"Create Account"}
      </Button>
      <span className="sign-up-footer">
        {"Already have an account? "}
        <strong>{"Login"}</strong>
      </span>
    </div>
  )
}

export default SignUpForm
