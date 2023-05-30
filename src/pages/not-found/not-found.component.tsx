import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button, { ButtonType } from "../../components/button/button.component";
import { selectCurrentUser } from "../../store/slices/user.slice";

import "./not-found.styles.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const navigationHandler = () => {
    user?.email ? navigate("/search") : navigate("/");
  };

  return (
    <div className="not-found-page-container">
      <h1>{"404"}</h1>
      <span className="title">{"Page not found"}</span>
      <Button
        onClick={navigationHandler}
        buttonType={ButtonType.BASE}
        styleClasses="not-found-btn"
      >
        {" Back to Search"}
      </Button>
    </div>
  );
};

export default NotFoundPage;
