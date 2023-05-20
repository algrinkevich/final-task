import SignUpForm from "../../components/sign-up-form/sign-up-form.component"
import StartPageBackground from "../../components/start-page-background/start-page-background.component"

import "./authentication.styles.scss"

const Authentication = () => {
  return (
    <StartPageBackground>
      <SignUpForm />
    </StartPageBackground>
  )
}

export default Authentication
