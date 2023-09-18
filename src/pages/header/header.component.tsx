import { Fragment, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import { resetState } from "../../store/slices/entries.slice";
import { selectCurrentUser } from "../../store/slices/user.slice";
import { AppDispatch } from "../../store/store";
import { signOutUserAsync } from "../../utils/firebase/firebase.utils";

import "./header.styles.scss";

const Header = () => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const navigateToAuth = useCallback(() => navigate("/auth"), [navigate]);

  const handleSignOut = useCallback(async () => {
    await signOutUserAsync();
    dispatch(resetState());
    navigate("/auth");
  }, [navigate, dispatch]);

  return (
    <Fragment>
      <div className="header-container">
        <span className="user-email">{currentUser?.email}</span>
        {currentUser?.email ? (
          <a onClick={handleSignOut} className="sign-out-link">
            {"Log out"}
          </a>
        ) : (
          <a onClick={navigateToAuth} className="sign-out-link">
            {"Log in"}
          </a>
        )}
      </div>

      <Outlet />
    </Fragment>
  );
};

export default Header;
