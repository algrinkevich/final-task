import { Fragment } from "react";
import { Form, Formik } from "formik";

import BaseAuthenticationForm from "../../components/base-authentication-form/base-authentication-form.component";
import Button, { ButtonType } from "../../components/button/button.component";
import FormInput from "../../components/form-input/form-input.component";

const SignUpForm = () => {
  const footerContent = (
    <Fragment>
      {"Already have an account? "}
      <strong>{"Login"}</strong>
    </Fragment>
  );

  return (
    <BaseAuthenticationForm title="Sign up" footerContent={footerContent}>
      <Formik
        initialValues={{ email: "", password: "", "confirm-password": "" }}
        onSubmit={() => alert("Sign Up!")}
      >
        {({ errors, touched, values }) => {
          const showEmailError = errors.email && touched.email;
          const showPasswordError = errors.password && touched.password;

          const showConfirmPasswordError =
            errors["confirm-password"] && touched["confirm-password"];

          const isButtonDisabled =
            Object.keys(errors).length > 0 ||
            !values.email ||
            !values.password ||
            !values["confirm-password"];

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
                  autoComplete="new-password"
                />
                {showPasswordError && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>
              <div className="form-input">
                <FormInput
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Enter your password again"
                  title="Repeat Password"
                  styleClasses={`${showConfirmPasswordError ? "error" : ""}`}
                  validate={(value) =>
                    value !== values.password
                      ? "Passwords do not match"
                      : undefined
                  }
                  autoComplete="new-password"
                />
                {showConfirmPasswordError && (
                  <div className="error-message">
                    {errors["confirm-password"]}
                  </div>
                )}
              </div>

              <Button
                disabled={isButtonDisabled}
                buttonType={ButtonType.INITIAL_BLUE}
                styleClasses="sign-up-container__button"
              >
                {"Create Account"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </BaseAuthenticationForm>
  );
};

export default SignUpForm;
