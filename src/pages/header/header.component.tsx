import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { selectCurrentUser } from "../../store/user/user.selector";
import { signOutUserAsync } from "../../utils/firebase/firebase.utils";

import "./header.styles.scss";

const Header = () => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Fragment>
      <div className="header-container">
        <span className="user-email">{currentUser?.email}</span>
        <a onClick={signOutUserAsync} className="sign-out-link">
          {"Log out"}
        </a>
      </div>

      <Outlet />
    </Fragment>
  );
};

export default Header;
