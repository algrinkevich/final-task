import { useState } from "react";

import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import StartPageBackground from "../../components/start-page-background/start-page-background.component";

enum FormType {
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
}

const Authentication = () => {
  const [currentForm, setCurrentForm] = useState(FormType.SIGN_IN);

  return (
    <StartPageBackground>
      {currentForm === FormType.SIGN_IN ? (
        <SignInForm onSignUpClick={() => setCurrentForm(FormType.SIGN_UP)} />
      ) : (
        <SignUpForm onLoginClick={() => setCurrentForm(FormType.SIGN_IN)} />
      )}
    </StartPageBackground>
  );
};

export default Authentication;
