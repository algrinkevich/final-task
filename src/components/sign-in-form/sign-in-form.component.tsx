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
import { signInAuthUserWithEmailAndPasswordAsync } from "../../utils/firebase/firebase.utils";

interface SignInData {
  email: string;
  password: string;
  backendError?: string;
}

const defaultFormFields: SignInData = {
  email: "",
  password: "",
  backendError: "",
};

const SignInForm = ({ onSignUpClick }: { onSignUpClick: () => void }) => {
  const handleSubmitAsync = async (
    values: SignInData,
    { setSubmitting, setFieldError }: FormikHelpers<SignInData>
  ) => {
    try {
      const response = await signInAuthUserWithEmailAndPasswordAsync(
        values.email,
        values.password
      );
    } catch (error) {
      const authError = error as AuthError;

      switch (authError.code) {
        case "auth/wrong-password":
          setFieldError("backendError", "Incorrect password for such email");
          setFieldError("password", " ");
          setSubmitting(false);
          break;
        case "auth/user-not-found":
          setFieldError(
            "backendError",
            "No such user associated with this email"
          );
          setFieldError("email", " ");
          setSubmitting(false);
          break;
        default:
          setFieldError("backendError", "Unexpected error");
          setSubmitting(false);
      }
    }
  };

  const footerContent = (
    <Fragment>
      {"Don’t have an account? "}
      <a onClick={onSignUpClick} className="redirect-link">
        {"Sign up"}
      </a>
    </Fragment>
  );

  return (
    <BaseAuthenticationForm title="Login" footerContent={footerContent}>
      <Formik initialValues={defaultFormFields} onSubmit={handleSubmitAsync}>
        {({
          errors,
          touched,
          values,
        }: {
          errors: FormikErrors<SignInData>;
          touched: FormikTouched<SignInData>;
          values: SignInData;
        }) => {
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
              {errors.backendError && (
                <div className="server-error-message">
                  {errors.backendError}
                </div>
              )}
              <Button
                disabled={isButtonDisabled}
                buttonType={ButtonType.INITIAL_BLUE}
                styleClasses="form-button"
                type="submit"
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
