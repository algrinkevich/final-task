import { Fragment } from "react";
import { AuthError } from "firebase/auth";
import {
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikTouched,
} from "formik";

import BaseAuthenticationForm from "../../components/base-authentication-form/base-authentication-form.component";
import Button, { ButtonType } from "../../components/button/button.component";
import FormInput from "../../components/form-input/form-input.component";
import { createAuthUserWithEmailAndPasswordAsync } from "../../utils/firebase/firebase.utils";

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  backendError?: string;
}

const defaultFormFields: SignUpData = {
  email: "",
  password: "",
  confirmPassword: "",
  backendError: "",
};

const SignUpForm = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const handleSubmitAsync = async (
    values: SignUpData,
    { setSubmitting, setFieldError }: FormikHelpers<SignUpData>
  ) => {
    try {
      const user = await createAuthUserWithEmailAndPasswordAsync(
        values.email,
        values.password
      );
    } catch (error) {
      const authError = error as AuthError;

      if (authError.code === "auth/email-already-in-use") {
        setFieldError(
          "backendError",
          "Cannot create user, email already in use"
        );
        //Empty space needs to emulate error
        setFieldError("email", " ");
        setSubmitting(false);
      } else {
        setFieldError("backendError", "Unexpected error");
        setSubmitting(false);
      }
    }
  };

  const footerContent = (
    <Fragment>
      {"Already have an account? "}
      <a onClick={onLoginClick} className="redirect-link">
        {"Login"}
      </a>
    </Fragment>
  );

  return (
    <BaseAuthenticationForm title="Sign up" footerContent={footerContent}>
      <Formik initialValues={defaultFormFields} onSubmit={handleSubmitAsync}>
        {({
          errors,
          touched,
          values,
        }: {
          errors: FormikErrors<SignUpData>;
          touched: FormikTouched<SignUpData>;
          values: SignUpData;
        }) => {
          const showEmailError = errors.email && touched.email;
          const showPasswordError = errors.password && touched.password;

          const showConfirmPasswordError =
            errors.confirmPassword && touched.confirmPassword;

          const isButtonDisabled =
            Object.keys(errors).length > 0 ||
            !values.email ||
            !values.password ||
            !values.confirmPassword;

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
                  id="confirmPassword"
                  name="confirmPassword"
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
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
              {errors.backendError && (
                <div className="server-error-message">
                  {errors.backendError}
                </div>
              )}

              <Button
                disabled={isButtonDisabled}
                buttonType={ButtonType.INITIAL_BLUE}
                styleClasses="sign-up-container__button"
                type="submit"
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
