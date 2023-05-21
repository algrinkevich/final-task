import Button, { ButtonType } from "../../components/button/button.component"
import StartPageBackground from "../../components/start-page-background/start-page-background.component"

import "./initial-page.styles.scss"

const InitialPage = () => {
  return (
    <StartPageBackground>
      <div className="initial-page-container">
        <h1 className="title">{"Q-1 Search"}</h1>
        <p className="description">
          {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"}
          {"eiusmod tempor incididunt u"}
        </p>
        <Button buttonType={ButtonType.INITIAL_WHITE}>{"Login"}</Button>
      </div>
    </StartPageBackground>
  )
}

export default InitialPage
