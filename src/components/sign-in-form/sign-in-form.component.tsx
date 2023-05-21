import { Fragment } from "react";
import { Form, Formik } from "formik";

import BaseAuthenticationForm from "../../components/base-authentication-form/base-authentication-form.component";
import Button, { ButtonType } from "../../components/button/button.component";
import FormInput from "../../components/form-input/form-input.component";

const SignInForm = ({ onSignUpClick }: { onSignUpClick: () => void }) => {
  const footerContent = (
    <Fragment>
      {"Don’t have an account? "}
      <a onClick={onSignUpClick} className="redirect-link">{"Sign up"}</a>
    </Fragment>
  );

  return (
    <BaseAuthenticationForm title="Login" footerContent={footerContent}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={() => alert("Login!!!")}
      >
        {({ errors, touched, values }) => {
          const showEmailError = errors.email && touched.email;
          const showPasswordError = errors.password && touched.password;

          const isButtonDisabled =
            Object.keys(errors).length > 0 || !values.email || !values.password;

          return (
            <Form>
              <div className="form-input">
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  title="Email"
                  styleClasses={`${showEmailError ? "error" : ""}`}
                  autoComplete="email"
                />
                {showEmailError && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-input">
                <FormInput
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  title="Password"
                  styleClasses={`${showPasswordError ? "error" : ""}`}
                  autoComplete="current-password"
                  validate={(value) =>
                    !value ? "The field is required" : undefined
                  }
                />
                {showPasswordError && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>
              <Button
                disabled={isButtonDisabled}
                buttonType={ButtonType.INITIAL_BLUE}
                styleClasses="form-button"
              >
                {"Login"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </BaseAuthenticationForm>
  );
};

export default SignInForm;
