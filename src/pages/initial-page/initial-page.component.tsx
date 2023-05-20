import Button, { ButtonType } from "../../components/button/button.component"

import "./initial-page.styles.scss"

const InitialPage = () => {
  return (
    <div className="initial-page-background">
      <div className="initial-page-container">
        <h1 className="title">{"Q-1 Search"}</h1>
        <p className="description">
          {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do"}
          {"eiusmod tempor incididunt u"}
        </p>
        <Button buttonType={ButtonType.BASE_WHITE}>{"Login"}</Button>
      </div>
    </div>
  )
}

export default InitialPage
