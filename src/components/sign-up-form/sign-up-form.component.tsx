import React, { Fragment } from "react";
import { AuthError } from "firebase/auth";
import { FormikErrors, FormikTouched, withFormik } from "formik";
import MailChecker from "mailchecker/platform/node";

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

interface SignUpFormProps {
  onLoginClick: () => void;
}

const SignUpFormBase = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  onLoginClick,
}: {
  errors: FormikErrors<SignUpData>;
  touched: FormikTouched<SignUpData>;
  values: SignUpData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLoginClick: () => void;
}) => {
  const showEmailError = errors.email && touched.email;
  const showPasswordError = errors.password && touched.password;

  const showConfirmPasswordError =
    errors.confirmPassword && touched.confirmPassword;

  const isButtonDisabled =
    !!errors.email ||
    !!errors.password ||
    !!errors.confirmPassword ||
    !values.email ||
    !values.password ||
    !values.confirmPassword;

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
            autoComplete="new-password"
            onChange={handleChange}
            onBlur={handleBlur}
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
            autoComplete="new-password"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {showConfirmPasswordError && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>
        {errors.backendError && (
          <div className="server-error-message">{errors.backendError}</div>
        )}

        <Button
          disabled={isButtonDisabled}
          buttonType={ButtonType.INITIAL_BLUE}
          styleClasses="sign-up-container__button"
          type="submit"
        >
          {"Create Account"}
        </Button>
      </form>
    </BaseAuthenticationForm>
  );
};

export function validateEmail(value: string) {
  let error;

  if (!value) {
    error = "The field is required";
  } else if (!MailChecker.isValid(value)) {
    error = "Invalid email address";
  }

  return error;
}

function validatePassword(value: string) {
  let error;

  if (!value) {
    error = "The field is required";
  } else if (value.length < 6) {
    error = "Minimum number of characters should be 6";
  } else if (value.search(/[a-z]/) === -1) {
    error = "Should contain at least 1 character in lower case";
  } else if (value.search(/[A-Z]/) === -1) {
    error = "Should contain at least 1 character in upper case";
  } else if (value.search(/\d/) === -1) {
    error = "Should contain at least 1 number";
  }

  return error;
}

const SignUpForm = withFormik<SignUpFormProps, SignUpData>({
  validate: (values: SignUpData) => {
    const errors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirmPassword:
        values.confirmPassword !== values.password
          ? "Passwords do not match"
          : null,
    };

    const cleanedUpErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, v]) => !!v)
    );

    return cleanedUpErrors;
  },
  // eslint-disable-next-line no-restricted-syntax
  handleSubmit: async (values, { setSubmitting, setFieldError }) => {
    try {
      await createAuthUserWithEmailAndPasswordAsync(
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
  },
})(SignUpFormBase);

export default SignUpForm;
