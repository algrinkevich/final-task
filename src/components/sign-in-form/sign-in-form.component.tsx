import { Fragment } from "react";
import { AuthError } from "firebase/auth";
import { FormikErrors, FormikTouched, withFormik } from "formik";

import BaseAuthenticationForm from "../../components/base-authentication-form/base-authentication-form.component";
import Button, { ButtonType } from "../../components/button/button.component";
import FormInput from "../../components/form-input/form-input.component";
import { signInAuthUserWithEmailAndPasswordAsync } from "../../utils/firebase/firebase.utils";
import { validateEmail } from "../sign-up-form/sign-up-form.component";

interface SignInData {
  email: string;
  password: string;
  backendError?: string;
}

interface SignInFormProps {
  onSignUpClick: () => void;
}

const SignInFormBase = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  onSignUpClick,
}: {
  errors: FormikErrors<SignInData>;
  touched: FormikTouched<SignInData>;
  values: SignInData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignUpClick: () => void;
}) => {
  const showEmailError = errors.email && touched.email;
  const showPasswordError = errors.password && touched.password;

  const isButtonDisabled =
    !!errors.email || !!errors.password || !values.email || !values.password;

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
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <FormInput
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            title="Email"
            styleClasses={`${showEmailError ? "error" : ""}`}
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
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
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {showPasswordError && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>
        {errors.backendError && (
          <div className="server-error-message">{errors.backendError}</div>
        )}
        <Button
          disabled={isButtonDisabled}
          buttonType={ButtonType.INITIAL_BLUE}
          styleClasses="form-button"
          type="submit"
        >
          {"Login"}
        </Button>
      </form>
    </BaseAuthenticationForm>
  );
};



const SignInForm = withFormik<SignInFormProps, SignInData>({
  validate: (values: SignInData) => {
    const errors = {
      email: validateEmail(values.email),
      password: !values.password ? "The field is required" : null,
    };

    const cleanedUpErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => !!v)
    );

    return cleanedUpErrors;
  },

  // eslint-disable-next-line no-restricted-syntax
  handleSubmit: async (values, { setSubmitting, setFieldError }) => {
    try {
      await signInAuthUserWithEmailAndPasswordAsync(
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
  },
})(SignInFormBase);

export default SignInForm;
